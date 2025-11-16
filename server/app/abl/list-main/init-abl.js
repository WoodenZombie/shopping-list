"use strict";
const Crypto = require("crypto");
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { UuAppWorkspace } = require("uu_appg01_server").Workspace;
const { AuthenticationService } = require("uu_appg01_server").Authentication;
const { UriBuilder } = require("uu_appg01_server").Uri;
const { UuDateTime } = require("uu_i18ng01");
const { ConsoleClient, ProgressClient } = require("uu_consoleg02-uulib");

const Errors = require("../../api/errors/list-main-error");
const Warnings = require("../../api/warnings/list-main-warning");
const Validator = require("../../components/validator");
const DtoBuilder = require("../../components/dto-builder");
const ScriptEngineClient = require("../../components/script-engine-client");
const ListMainClient = require("../../components/list-main-client");
const StepHandler = require("../../components/step-handler");
const InitRollbackAbl = require("./init-rollback-abl");

const ConsoleConstants = require("../../constants/console-constants");
const ProgressConstants = require("../../constants/progress-constants");
const ListMainConstants = require("../../constants/list-main-constants");
const Configuration = require("../../components/configuration");

const SCRIPT_CODE = "shopping _list_maing01-uuscriptlib/list-main/init";

class InitAbl {
  constructor() {
    this.dao = DaoFactory.getDao(ListMainConstants.Schemas.LIST_INSTANCE);
  }

  async init(uri, dtoIn) {
    // HDS 1
    const awid = uri.getAwid();
    this._validateDtoIn(uri, dtoIn);

    // HDS 2
    let shopping List = await this.dao.getByAwid(awid);
    let uuAppWorkspace = await UuAppWorkspace.get(awid);

    // HDS 3
    this._validateMode(shopping List, dtoIn, uuAppWorkspace.sysState);

    // HDS 4
    const configuration = await Configuration.getUuSubAppConfiguration({
      awid,
      artifactId: dtoIn.data.locationId || shopping List.temporaryData.dtoIn.locationId,
      uuTerritoryBaseUri: dtoIn.data.uuTerritoryBaseUri || shopping List.temporaryData.dtoIn.uuTerritoryBaseUri,
    });

    // HDS 5
    let initData;
    switch (dtoIn.mode) {
      case ListMainConstants.ModeMap.STANDARD: {
        initData = dtoIn.data;
        const uuTerritoryBaseUri = this._parseTerritoryUri(initData.uuTerritoryBaseUri);
        const temporaryData = {
          useCase: uri.getUseCase(),
          dtoIn: { ...initData },
          stepList: [ListMainConstants.InitStepMap.LIST_OBJECT_CREATED.code],
          progressMap: {
            uuConsoleUri: configuration.uuConsoleBaseUri,
            progressCode: ListMainConstants.getInitProgressCode(awid),
            consoleCode: ListMainConstants.getMainConsoleCode(awid),
          },
        };

        shopping List = await this.dao.create({
          awid,
          state: ListMainConstants.StateMap.CREATED,
          code: `${ListMainConstants.AWSC_PREFIX}/${awid}`,
          uuTerritoryBaseUri: uuTerritoryBaseUri.toString(),
          name: initData.name,
          desc: initData.desc,
          temporaryData,
        });

        try {
          await UuAppWorkspace.setBeingInitializedSysState(awid);
        } catch (e) {
          throw new Errors.Init.SetBeingInitializedSysStateFailed({}, e);
        }
        break;
      }

      case ListMainConstants.ModeMap.RETRY: {
        initData = shopping List.temporaryData.dtoIn;
        break;
      }

      case ListMainConstants.ModeMap.ROLLBACK: {
        shopping List.temporaryData.rollbackMode = true;
        if (!shopping List.temporaryData.rollbackStepList) {
          shopping List.temporaryData.rollbackStepList = [];
        }
        shopping List = await this.dao.updateByAwid({ ...shopping List });
        initData = shopping List.temporaryData.dtoIn;
        break;
      }

      default: {
        throw new Errors.Init.WrongModeAndCircumstances({
          mode: dtoIn.mode,
          appObjectState: shopping List?.state,
          temporaryData: shopping List?.temporaryData,
        });
      }
    }

    // HDS 6
    const sysIdentitySession = await AuthenticationService.authenticateSystemIdentity();
    const lockSecret = Crypto.randomBytes(32).toString("hex");
    const progressClient = await this._createInitProgress(
      shopping List,
      dtoIn,
      configuration,
      lockSecret,
      sysIdentitySession,
    );

    // HDS 7
    switch (dtoIn.mode) {
      case ListMainConstants.ModeMap.STANDARD:
      case ListMainConstants.ModeMap.RETRY: {
        const stepHandler = new StepHandler({
          schema: ListMainConstants.Schemas.LIST_INSTANCE,
          progressClient,
          stepList: shopping List?.temporaryData?.stepList,
        });

        const listMainClient = new ListMainClient(shopping List, shopping List.uuTerritoryBaseUri);

        shopping List = await stepHandler.handleStep(shopping List, ListMainConstants.InitStepMap.AWSC_CREATED, async () => {
          shopping List.state = ListMainConstants.StateMap.BEING_INITIALIZED;
          await this.dao.updateByAwid({ ...shopping List });
          await listMainClient.createAwsc(
            initData.locationId,
            initData.responsibleRoleId,
            initData.permissionMatrix,
            configuration.uuAppMetaModelVersion,
          );
        });

        shopping List = await stepHandler.handleStep(shopping List, ListMainConstants.InitStepMap.WS_CONNECTED, async () => {
          await this._connectAwsc(shopping List, uri.getBaseUri(), shopping List.uuTerritoryBaseUri, sysIdentitySession);
        });

        shopping List = await stepHandler.handleStep(shopping List, ListMainConstants.InitStepMap.CONSOLE_CREATED, async () => {
          await this._createConsole(shopping List, configuration, sysIdentitySession);
        });

        // TODO If your application requires any additional steps, add them here...

        if (!shopping List.temporaryData.stepList.includes(ListMainConstants.InitStepMap.PROGRESS_ENDED.code)) {
          await this._runScript(uri.getBaseUri(), configuration, lockSecret, sysIdentitySession);
        } else {
          await this._initFinalize(uri, { lockSecret });
        }
        break;
      }

      case ListMainConstants.ModeMap.ROLLBACK: {
        if (
          shopping List.temporaryData.stepList.includes(ListMainConstants.InitStepMap.CONSOLE_CREATED.code) &&
          !shopping List.temporaryData.rollbackStepList.includes(ListMainConstants.InitRollbackStepMap.CONSOLE_CLEARED.code)
        ) {
          await InitRollbackAbl.initRollback(uri.getBaseUri(), configuration, lockSecret);
        } else {
          await InitRollbackAbl._initFinalizeRollback(uri, { lockSecret });
        }
        break;
      }

      default: {
        throw new Errors.Init.WrongModeAndCircumstances({
          mode: dtoIn.mode,
          appObjectState: shopping List?.state,
          temporaryData: shopping List?.temporaryData,
        });
      }
    }

    // HDS 8
    return DtoBuilder.prepareDtoOut({ data: shopping List });
  }

  async _initFinalize(uri, dtoIn) {
    // HDS 1
    const awid = uri.getAwid();
    Validator.validateDtoInCustom(uri, dtoIn, "sysUuAppWorkspaceInitFinalizeDtoInType");

    // HDS 2
    let shopping List = await this.dao.getByAwid(awid);

    if (!shopping List) {
      // 2.1
      throw new Errors._initFinalize.Shopping ListDoesNotExist({ awid });
    }

    if (![ListMainConstants.StateMap.BEING_INITIALIZED, ListMainConstants.StateMap.ACTIVE].includes(shopping List.state)) {
      // 2.2
      throw new Errors._initFinalize.NotInProperState({
        state: shopping List.state,
        expectedStateList: [ListMainConstants.StateMap.BEING_INITIALIZED, ListMainConstants.StateMap.ACTIVE],
      });
    }

    // HDS 3
    const sysIdentitySession = await AuthenticationService.authenticateSystemIdentity();
    const progress = {
      code: ListMainConstants.getInitProgressCode(shopping List.awid),
      lockSecret: dtoIn.lockSecret,
    };
    let progressClient = null;
    if (!shopping List.temporaryData.stepList.includes(ListMainConstants.InitStepMap.PROGRESS_ENDED.code)) {
      progressClient = await ProgressClient.get(shopping List.temporaryData.progressMap.uuConsoleUri, progress, {
        session: sysIdentitySession,
      });
    }
    const stepHandler = new StepHandler({
      schema: ListMainConstants.Schemas.LIST_INSTANCE,
      progressClient,
      stepList: shopping List.temporaryData.stepList,
    });

    // TODO If your application requires any additional steps, add them here...

    // HDS 4
    shopping List = await stepHandler.handleStep(
      shopping List,
      ListMainConstants.InitStepMap.PROGRESS_ENDED,
      async () => {
        await progressClient.end({
          state: ProgressConstants.StateMap.COMPLETED,
          message: "Initialization finished.",
          doneWork: ListMainConstants.getInitStepCount(),
        });
      },
      false,
    );

    // HDS 5
    if (shopping List.state === ListMainConstants.StateMap.BEING_INITIALIZED) {
      shopping List = await this.dao.updateByAwid({ awid, state: ListMainConstants.StateMap.ACTIVE, temporaryData: null });
    }

    // HDS 6
    await UuAppWorkspace.setActiveSysState(awid);

    // HDS 7
    return DtoBuilder.prepareDtoOut({ data: shopping List });
  }

  // Validates dtoIn. In case of standard mode the data key of dtoIn is also validated.
  _validateDtoIn(uri, dtoIn) {
    let uuAppErrorMap = Validator.validateDtoIn(uri, dtoIn);
    if (dtoIn.mode === ListMainConstants.ModeMap.STANDARD) {
      Validator.validateDtoInCustom(uri, dtoIn.data, "sysUuAppWorkspaceInitStandardDtoInType", uuAppErrorMap);
    }
    return uuAppErrorMap;
  }

  _validateMode(shopping List, dtoIn, sysState) {
    switch (dtoIn.mode) {
      case ListMainConstants.ModeMap.STANDARD:
        if (![UuAppWorkspace.SYS_STATES.ASSIGNED, UuAppWorkspace.SYS_STATES.BEING_INITIALIZED].includes(sysState)) {
          // 3.A.1.1.
          throw new Errors.Init.SysUuAppWorkspaceIsNotInProperState({
            sysState,
            expectedSysStateList: [UuAppWorkspace.SYS_STATES.ASSIGNED, UuAppWorkspace.SYS_STATES.BEING_INITIALIZED],
          });
        }
        if (shopping List) {
          // 3.A.2.1.
          throw new Errors.Init.Shopping ListObjectAlreadyExist({
            mode: dtoIn.mode,
            allowedModeList: [ListMainConstants.ModeMap.RETRY, ListMainConstants.ModeMap.ROLLBACK],
          });
        }
        break;

      case ListMainConstants.ModeMap.RETRY:
        if (sysState !== UuAppWorkspace.SYS_STATES.BEING_INITIALIZED) {
          // 3.B.1.1.
          throw new Errors.Init.SysUuAppWorkspaceIsNotInProperState({
            sysState,
            expectedSysStateList: [UuAppWorkspace.SYS_STATES.BEING_INITIALIZED],
          });
        }
        if (!shopping List?.temporaryData) {
          // 3.B.2.1.
          throw new Errors.Init.MissingRequiredData();
        }
        if (shopping List?.temporaryData?.rollbackMode) {
          // 3.B.3.1.
          throw new Errors.Init.RollbackNotFinished();
        }
        break;

      case ListMainConstants.ModeMap.ROLLBACK:
        if (sysState !== UuAppWorkspace.SYS_STATES.BEING_INITIALIZED) {
          // 3.C.1.1.
          throw new Errors.Init.SysUuAppWorkspaceIsNotInProperState({
            sysState,
            expectedSysStateList: [UuAppWorkspace.SYS_STATES.BEING_INITIALIZED],
          });
        }
        if (!shopping List?.temporaryData) {
          // 3.C.2.1.
          throw new Errors.Init.MissingRequiredData();
        }
        if (!dtoIn.force && shopping List?.temporaryData?.rollbackMode) {
          // 3.C.3.1.
          throw new Errors.Init.RollbackAlreadyRunning();
        }
        break;
    }
  }

  _parseTerritoryUri(locationUri) {
    let uuTerritoryUri;

    try {
      uuTerritoryUri = UriBuilder.parse(locationUri).toUri();
    } catch (e) {
      throw new Errors.Init.UuTLocationUriParseFailed({ uri: locationUri }, e);
    }

    return uuTerritoryUri.getBaseUri();
  }

  async _createInitProgress(shopping List, dtoIn, config, lockSecret, session) {
    let progressClient;
    let progress = {
      expireAt: UuDateTime.now().shift("day", 7),
      name: ListMainConstants.getInitProgressName(shopping List.awid),
      code: ListMainConstants.getInitProgressCode(shopping List.awid),
      authorizationStrategy: "uuIdentityList",
      permissionMap: await this._getInitProgressPermissionMap(shopping List.awid, session),
      lockSecret,
    };

    try {
      progressClient = await ProgressClient.get(config.uuConsoleBaseUri, { code: progress.code }, { session });
    } catch (e) {
      if (e.cause?.code !== ProgressConstants.PROGRESS_DOES_NOT_EXIST) {
        throw new Errors.Init.ProgressGetCallFailed({ progressCode: progress.code }, e);
      }
    }

    if (!progressClient) {
      try {
        progressClient = await ProgressClient.createInstance(config.uuConsoleBaseUri, progress, { session });
      } catch (e) {
        throw new Errors.Init.ProgressCreateCallFailed({ progressCode: progress.code }, e);
      }
    } else if (dtoIn.force) {
      try {
        await progressClient.releaseLock();
      } catch (e) {
        if (e.cause?.code !== ProgressConstants.PROGRESS_RELEASE_DOES_NOT_EXIST) {
          throw new Errors.Init.ProgressReleaseLockCallFailed({ progressCode: progress.code }, e);
        }
      }

      try {
        await progressClient.setState({ state: "cancelled" });
      } catch (e) {
        DtoBuilder.addWarning(new Warnings.Init.ProgressSetStateCallFailed(e.cause?.paramMap));
      }

      try {
        await progressClient.delete();
      } catch (e) {
        if (e.cause?.code !== ProgressConstants.PROGRESS_DELETE_DOES_NOT_EXIST) {
          throw new Errors.Init.ProgressDeleteCallFailed({ progressCode: progress.code }, e);
        }
      }

      try {
        progressClient = await ProgressClient.createInstance(config.uuConsoleBaseUri, progress, { session });
      } catch (e) {
        throw new Errors.Init.ProgressCreateCallFailed({ progressCode: progress.code }, e);
      }
    }

    try {
      await progressClient.start({
        message: "Progress was started",
        totalWork:
          dtoIn.mode === ListMainConstants.ModeMap.ROLLBACK
            ? ListMainConstants.getInitRollbackStepCount()
            : ListMainConstants.getInitStepCount(),
        lockSecret,
      });
    } catch (e) {
      throw new Errors.Init.ProgressStartCallFailed({ progressCode: progress.code }, e);
    }

    return progressClient;
  }

  async _getInitProgressPermissionMap(awid, sysIdentitySession) {
    const awidData = await UuAppWorkspace.get(awid);

    let permissionMap = {};
    for (let identity of awidData.awidInitiatorList) {
      permissionMap[identity] = ListMainConstants.CONSOLE_BOUND_MATRIX.Authorities;
    }
    permissionMap[sysIdentitySession.getIdentity().getUuIdentity()] =
      ListMainConstants.CONSOLE_BOUND_MATRIX.Authorities;

    return permissionMap;
  }

  async _connectAwsc(shopping List, appUri, uuTerritoryBaseUri, session) {
    const artifactUri = UriBuilder.parse(uuTerritoryBaseUri).setParameter("id", shopping List.artifactId).toUri().toString();

    try {
      await UuAppWorkspace.connectArtifact(appUri, { artifactUri }, session);
    } catch (e) {
      throw new Errors.ListMain.ConnectAwscFailed(
        {
          awid: shopping List.awid,
          awscId: shopping List.artifactId,
          uuTerritoryBaseUri,
        },
        e,
      );
    }
  }

  async _createConsole(shopping List, configuration, session) {
    const artifactUri = UriBuilder.parse(shopping List.uuTerritoryBaseUri).setParameter("id", shopping List.artifactId).toString();
    const console = {
      code: ListMainConstants.getMainConsoleCode(shopping List.awid),
      authorizationStrategy: "boundArtifact",
      boundArtifactUri: artifactUri,
      boundArtifactPermissionMatrix: ListMainConstants.CONSOLE_BOUND_MATRIX,
    };

    try {
      await ConsoleClient.createInstance(configuration.uuConsoleBaseUri, console, { session });
    } catch (e) {
      throw new Errors.Init.FailedToCreateConsole({}, e);
    }
  }

  async _setConsoleExpiration(uuConsoleUri, consoleCode, session) {
    let consoleClient;
    try {
      consoleClient = await ConsoleClient.get(uuConsoleUri, { code: consoleCode }, { session });
    } catch (e) {
      if (e.cause?.code === ConsoleConstants.CONSOLE_GET_DOES_NOT_EXISTS) {
        throw new Errors._initFinalize.ConsoleGetCallFailed({ code: consoleCode }, e);
      }
    }

    try {
      await consoleClient.update({ expireAt: new UuDateTime().shift("day", 7).date });
    } catch (e) {
      if (e.cause?.code === ConsoleConstants.CONSOLE_UPDATE_DOES_NOT_EXISTS) {
        DtoBuilder.addWarning(new Warnings._initFinalize.ConsoleDoesNotExist({ code: consoleCode }));
      } else {
        throw new Errors._initFinalize.ConsoleUpdateCallFailed({ code: consoleCode }, e);
      }
    }
  }

  async _runScript(appUri, configuration, lockSecret, session) {
    const scriptEngineClient = new ScriptEngineClient({
      scriptEngineUri: configuration.uuScriptEngineBaseUri,
      consoleUri: configuration.uuConsoleBaseUri,
      consoleCode: ListMainConstants.getMainConsoleCode(appUri.getAwid()),
      scriptRepositoryUri: configuration.uuScriptRepositoryBaseUri,
      session,
    });

    const scriptDtoIn = {
      shopping ListUri: appUri.toString(),
      lockSecret,
    };

    await scriptEngineClient.runScript({ scriptCode: SCRIPT_CODE, scriptDtoIn });
  }
}

module.exports = new InitAbl();
