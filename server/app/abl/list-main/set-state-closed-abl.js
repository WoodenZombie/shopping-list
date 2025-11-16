"use strict";
const Crypto = require("crypto");
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { AuthenticationService } = require("uu_appg01_server").Authentication;
const { UriBuilder } = require("uu_appg01_server").Uri;
const { UuDateTime } = require("uu_i18ng01");
const { ProgressClient } = require("uu_consoleg02-uulib");

const Errors = require("../../api/errors/list-main-error");
const Warnings = require("../../api/warnings/list-main-warning");
const Validator = require("../../components/validator");
const DtoBuilder = require("../../components/dto-builder");
const ScriptEngineClient = require("../../components/script-engine-client");
const ListMainClient = require("../../components/list-main-client");
const StepHandler = require("../../components/step-handler");

const ProgressConstants = require("../../constants/progress-constants");
const ListMainConstants = require("../../constants/list-main-constants");
const TerritoryConstants = require("../../constants/territory-constants");
const Configuration = require("../../components/configuration");

const SCRIPT_CODE = "shopping _list_maing01-uuscriptlib/list-main/set-state-closed";

class SetStateClosedAbl {
  constructor() {
    this.dao = DaoFactory.getDao(ListMainConstants.Schemas.LIST_INSTANCE);
  }

  async setStateClosed(uri, dtoIn) {
    // HDS 1
    const awid = uri.getAwid();
    Validator.validateDtoIn(uri, dtoIn);

    // HDS 2
    let shopping List = await this.dao.getByAwid(awid);

    if (!shopping List) {
      // 2.1
      throw new Errors.SetStateClosed.Shopping ListDoesNotExist({ awid });
    }

    if (shopping List.state !== ListMainConstants.StateMap.ACTIVE) {
      // 2.2
      throw new Errors.SetStateClosed.NotInProperState({
        state: shopping List.state,
        expectedStateList: [ListMainConstants.StateMap.ACTIVE],
      });
    }

    if (shopping List.temporaryData && shopping List.temporaryData.useCase !== uri.getUseCase()) {
      // 2.3
      throw new Errors.SetStateClosed.UseCaseExecutionForbidden({
        concurrencyUseCase: shopping List.temporaryData.useCase,
      });
    }

    // HDS 3
    const configuration = await Configuration.getUuSubAppConfiguration({
      awid,
      artifactId: shopping List.artifactId,
      uuTerritoryBaseUri: shopping List.uuTerritoryBaseUri,
    });

    // HDS 4
    const sysIdentitySession = await AuthenticationService.authenticateSystemIdentity();
    const lockSecret = Crypto.randomBytes(32).toString("hex");
    const progressClient = await this._createSetStateClosedProgress(
      shopping List,
      dtoIn,
      configuration,
      lockSecret,
      sysIdentitySession,
    );

    // HDS 5
    if (!shopping List.temporaryData) {
      shopping List = await this.dao.updateByAwid({
        awid,
        temporaryData: {
          useCase: uri.getUseCase(),
          dtoIn: {},
          stepList: [ListMainConstants.SetStateClosedStepMap.CLOSE_STARTED.code],
          progressMap: {
            progressCode: progressClient.progress.code,
            uuConsoleUri: configuration.uuConsoleBaseUri,
            consoleCode: ListMainConstants.getMainConsoleCode(awid),
          },
        },
      });
    }

    // TODO If your application requires any additional steps, add them here...

    // HDS 6
    await this._runScript(uri.getBaseUri(), configuration, progressClient.progress.lockSecret, sysIdentitySession);

    // HDS 7
    return DtoBuilder.prepareDtoOut({ data: shopping List });
  }

  async _setStateClosedFinalize(uri, dtoIn) {
    // HDS 1
    const awid = uri.getAwid();
    Validator.validateDtoInCustom(uri, dtoIn, "sysUuAppWorkspaceSetStateClosedFinalizeDtoInType");

    // HDS 2
    let shopping List = await this.dao.getByAwid(awid);

    if (!shopping List) {
      // 2.1
      throw new Errors._setStateClosedFinalize.Shopping ListDoesNotExist({ awid });
    }

    if (!shopping List.state === ListMainConstants.StateMap.ACTIVE) {
      // 2.2
      throw new Errors._setStateClosedFinalize.NotInProperState({
        state: shopping List.state,
        expectedStateList: [ListMainConstants.StateMap.ACTIVE],
      });
    }

    if (!shopping List.temporaryData) {
      // 2.3
      throw new Errors._setStateClosedFinalize.MissingRequiredData();
    }

    if (shopping List.temporaryData && shopping List.temporaryData.useCase !== "sys/uuAppWorkspace/setStateClosed") {
      // 2.4
      throw new Errors._setStateClosedFinalize.UseCaseExecutionForbidden({
        concurrencyUseCase: shopping List.temporaryData.useCase,
      });
    }

    // HDS 3
    const sysIdentitySession = await AuthenticationService.authenticateSystemIdentity();
    const progress = {
      code: ListMainConstants.getSetStateClosedProgressCode(shopping List.awid),
      lockSecret: dtoIn.lockSecret,
    };
    let progressClient = null;
    if (!shopping List.temporaryData.stepList.includes(ListMainConstants.SetStateClosedStepMap.PROGRESS_ENDED.code)) {
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
    shopping List = await stepHandler.handleStep(shopping List, ListMainConstants.SetStateClosedStepMap.AWSC_CLOSED, async () => {
      const listMainClient = new ListMainClient(shopping List, shopping List.uuTerritoryBaseUri);
      try {
        await listMainClient.setAwscState(ListMainConstants.StateMap.FINAL);
      } catch (e) {
        if (e.cause?.code !== TerritoryConstants.INVALID_ARTIFACT_STATE) {
          throw e;
        } else {
          DtoBuilder.addWarning(new Warnings._setStateClosedFinalize.AwscAlreadyInFinalState());
        }
      }
    });

    // HDS 5
    shopping List = await stepHandler.handleStep(
      shopping List,
      ListMainConstants.SetStateClosedStepMap.PROGRESS_ENDED,
      async () => {
        await progressClient.end({
          state: ProgressConstants.StateMap.COMPLETED,
          message: "Setting closed state finished.",
          expireAt: UuDateTime.now().shift("day", 7),
          doneWork: ListMainConstants.getSetStateClosedStepCount(),
        });
      },
      false,
    );

    // HDS 6
    shopping List = await this.dao.updateByAwid({
      awid,
      state: ListMainConstants.StateMap.FINAL,
      temporaryData: null,
    });

    // HDS 7
    return DtoBuilder.prepareDtoOut();
  }

  _parseTerritoryUri(locationUri) {
    let uuTerritoryUri;

    try {
      uuTerritoryUri = UriBuilder.parse(locationUri);
    } catch (e) {
      throw new Errors.SetStateClosed.UuTLocationUriParseFailed({ uri: locationUri }, e);
    }

    return uuTerritoryUri;
  }

  async _createSetStateClosedProgress(shopping List, dtoIn, config, lockSecret, session) {
    const uuTerritoryUri = this._parseTerritoryUri(shopping List.uuTerritoryBaseUri);

    let progressClient;
    let progress = {
      expireAt: UuDateTime.now().shift("day", 7),
      name: ListMainConstants.getSetStateClosedProgressName(shopping List.awid),
      code: ListMainConstants.getSetStateClosedProgressCode(shopping List.awid),
      authorizationStrategy: "boundArtifact",
      boundArtifactUri: uuTerritoryUri.setParameter("id", shopping List.artifactId).toUri().toString(),
      boundArtifactPermissionMatrix: ListMainConstants.CONSOLE_BOUND_MATRIX,
      lockSecret,
    };

    try {
      progressClient = await ProgressClient.get(config.uuConsoleBaseUri, { code: progress.code }, { session });
    } catch (e) {
      if (e.cause?.code !== ProgressConstants.PROGRESS_DOES_NOT_EXIST) {
        throw new Errors.SetStateClosed.ProgressGetCallFailed({ progressCode: progress.code }, e);
      }
    }

    if (!progressClient) {
      try {
        progressClient = await ProgressClient.createInstance(config.uuConsoleBaseUri, progress, { session });
      } catch (e) {
        throw new Errors.SetStateClosed.ProgressCreateCallFailed({ progressCode: progress.code }, e);
      }
    } else if (dtoIn.force) {
      try {
        await progressClient.releaseLock();
      } catch (e) {
        if (e.cause?.code !== ProgressConstants.PROGRESS_RELEASE_DOES_NOT_EXIST) {
          throw new Errors.SetStateClosed.ProgressReleaseLockCallFailed({ progressCode: progress.code }, e);
        }
      }

      try {
        await progressClient.setState({ state: "cancelled" });
      } catch (e) {
        DtoBuilder.addWarning(new Warnings.SetStateClosed.ProgressSetStateCallFailed(e.cause?.paramMap));
      }

      try {
        await progressClient.delete();
      } catch (e) {
        if (e.cause?.code !== ProgressConstants.PROGRESS_DELETE_DOES_NOT_EXIST) {
          throw new Errors.SetStateClosed.ProgressDeleteCallFailed({ progressCode: progress.code }, e);
        }
      }

      try {
        progressClient = await ProgressClient.createInstance(config.uuConsoleBaseUri, progress, { session });
      } catch (e) {
        throw new Errors.SetStateClosed.ProgressCreateCallFailed({ progressCode: progress.code }, e);
      }
    }

    try {
      await progressClient.start({
        message: "Progress was started",
        totalWork: ListMainConstants.getSetStateClosedStepCount(),
        lockSecret,
      });
    } catch (e) {
      throw new Errors.SetStateClosed.ProgressStartCallFailed({ progressCode: progress.code }, e);
    }

    return progressClient;
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

module.exports = new SetStateClosedAbl();
