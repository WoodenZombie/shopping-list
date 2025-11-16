"use strict";
const { UseCaseContext } = require("uu_appg01_server").AppServer;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { UuTerrClient } = require("uu_territory_clientg01");

const TerritoryConstants = require("../constants/territory-constants");
const DtoBuilder = require("./dto-builder");
const { ListMain: Errors } = require("../api/errors/list-main-error");
const Warnings = require("../api/warnings/list-main-warning");
const ListMainConstants = require("../constants/list-main-constants");

class ListMainClient {
  constructor(shopping List, territoryUri = null, session = null) {
    this.dao = DaoFactory.getDao(ListMainConstants.Schemas.LIST_INSTANCE);
    this.shopping List = shopping List;
    this.uri = UseCaseContext.getUri();
    this.territoryUri = territoryUri ? territoryUri : shopping List.uuTerritoryBaseUri;
    this.session = session ? session : UseCaseContext.getSession();
  }

  async createAwsc(location, responsibleRole, permissionMatrix, uuAppMetaModelVersion) {
    const appClientOpts = this.getAppClientOpts();
    const { name, desc } = this.shopping List;
    const awscCreateDtoIn = {
      name,
      desc,
      code: `${ListMainConstants.AWSC_PREFIX}/${this.shopping List.awid}`,
      location,
      responsibleRole,
      permissionMatrix,
      typeCode: ListMainConstants.UUAPP_CODE,
      uuAppWorkspaceUri: this.uri.getBaseUri(),
      uuAppMetaModelVersion,
    };

    let awsc;
    try {
      awsc = await UuTerrClient.Awsc.create(awscCreateDtoIn, appClientOpts);
    } catch (e) {
      const awscCreateErrorMap = (e.dtoOut && e.dtoOut.uuAppErrorMap) || {};

      const isDup =
        awscCreateErrorMap[TerritoryConstants.AWSC_CREATE_FAILED_CODE] &&
        awscCreateErrorMap[TerritoryConstants.AWSC_CREATE_FAILED_CODE].cause &&
        awscCreateErrorMap[TerritoryConstants.AWSC_CREATE_FAILED_CODE].cause[TerritoryConstants.NOT_UNIQUE_ID_CODE];

      if (isDup) {
        DtoBuilder.addWarning(new Warnings.Init.UuAwscAlreadyCreated());
        awsc = await UuTerrClient.Awsc.get(
          { code: `${ListMainConstants.AWSC_PREFIX}/${this.shopping List.awid}` },
          appClientOpts,
        );
      } else {
        DtoBuilder.addUuAppErrorMap(awscCreateErrorMap);
        throw new Errors.CreateAwscFailed(
          { uuTerritoryBaseUri: this.shopping List.uuTerritoryBaseUri, awid: this.shopping List.awid },
          e,
        );
      }
    }

    this.shopping List = await this.dao.updateByAwid({
      awid: this.shopping List.awid,
      artifactId: awsc.id,
    });

    return this.shopping List;
  }

  async loadAwsc() {
    const appClientOpts = this.getAppClientOpts();

    let awsc;
    try {
      awsc = await UuTerrClient.Awsc.load({ id: this.shopping List.artifactId }, appClientOpts);
    } catch (e) {
      throw new Errors.LoadAwscFailed({ artifactId: this.shopping List.artifactId }, e);
    }

    return awsc;
  }

  async setAwscState(state) {
    const appClientOpts = this.getAppClientOpts();
    try {
      await UuTerrClient.Awsc.setState(
        {
          id: this.shopping List.artifactId,
          state,
        },
        appClientOpts,
      );
    } catch (e) {
      throw new Errors.SetAwscStateFailed({ state, id: this.shopping List.artifactId }, e);
    }
  }

  async deleteAwsc() {
    const appClientOpts = this.getAppClientOpts();
    try {
      await UuTerrClient.Awsc.delete({ id: this.shopping List.artifactId }, appClientOpts);
    } catch (e) {
      if (e.cause?.code !== TerritoryConstants.ARTIFACT_DOES_NOT_EXIST) {
        throw new Errors.DeleteAwscFailed({ id: this.shopping List.artifactId }, e);
      }
    }
  }

  getAppClientOpts() {
    return { baseUri: this.territoryUri, session: this.session, appUri: this.uri };
  }
}

module.exports = ListMainClient;
