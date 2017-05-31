import R from "ramda";
import React from "react";
import ThirdPart from "./thirdPart";
import AddPriorityModal from "./AddPriorityModal";
import SmallTableRow from "./SmallTableRow";
import BigTableRow from "./BigTableRow";
import DetailModal from "./DetailModal";

class TableDistribution extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentType: null,
      device_id: null,
      model_id: null,
      os_id: null,
      os_version_id: null,
      browser_id: null,
      browser_version_id: null,
      showDeviceModal: false,
      showModelModal: false,
      showOsModal: false,
      showOsVersionModal: false,
      showBrowserModal: false,
      showBrowserVersionModal: false,
      showDetailOsVersion: false,
      showArchModal: false
    };
    this.getFirstThird = this.getFirstThird.bind(this);
    this.getSecondThird = this.getSecondThird.bind(this);
    this.getLastThird = this.getLastThird.bind(this);
    this.getModals = this.getModals.bind(this);
    this.hideModals = this.hideModals.bind(this);
    this.hideArchModal = this.hideArchModal.bind(this);
    this.openDeviceModal = this.openDeviceModal.bind(this);
    this.openModelModal = this.openModelModal.bind(this);
    this.openOsModal = this.openOsModal.bind(this);
    this.openBrowserModal = this.openBrowserModal.bind(this);
    this.openOsVersionModal = this.openOsVersionModal.bind(this);
    this.openBrowserVersionModal = this.openBrowserVersionModal.bind(this);
    this.openDetailOsVersion = this.openDetailOsVersion.bind(this);
    this.openArchModal = this.openArchModal.bind(this);
    this.getCurrentTypeItems = this.getCurrentTypeItems.bind(this);
    this.selectDevice = this.selectDevice.bind(this);
    this.selectModel = this.selectModel.bind(this);
    this.selectOs = this.selectOs.bind(this);
    this.selectOsVersion = this.selectOsVersion.bind(this);
    this.selectBrowser = this.selectBrowser.bind(this);
    this.selectBrowserVersion = this.selectBrowserVersion.bind(this);
    this.afterFetchAction = this.afterFetchAction.bind(this);
  }

  openDeviceModal() {
    this.setState({ showDeviceModal: true, currentType: "devices" });
  }

  hideModals() {
    this.setState({
      showDeviceModal: false,
      showModelModal: false,
      showOsModal: false,
      showOsVersionModal: false,
      showBrowserModal: false,
      showBrowserVersionModal: false,
      showDetailOsVersion: false
    });
  }

  hideArchModal() {
    this.setState({ showArchModal: false });
  }

  openModelModal() {
    this.setState({ showModelModal: true, currentType: "models" });
  }

  openOsModal() {
    this.setState({ showOsModal: true, currentType: "oses" });
  }

  openOsVersionModal() {
    this.setState({ showOsVersionModal: true, currentType: "os_versions" });
  }

  openBrowserModal() {
    this.setState({ showBrowserModal: true, currentType: "browsers" });
  }

  openBrowserVersionModal() {
    this.setState({
      showBrowserVersionModal: true,
      currentType: "browser_versions"
    });
  }

  openDetailOsVersion() {
    this.setState({
      showDetailOsVersion: true
    });
  }

  openArchModal() {
    this.setState({
      showArchModal: true,
      currentType: "archs"
    });
  }

  componentWillReceiveProps(nextProps) {
    if (!R.isEmpty(this.props.devices.priorities)) return;

    if (!R.isEmpty(nextProps.devices.priorities)) {
      const { id } = nextProps.devices.priorities[0];
      this.props.onDeviceRowClick(
        id,
        this.selectDevice,
        this.afterFetchAction("models")
      )();
    }
  }

  selectDevice(device_id) {
    this.setState({ device_id });
  }

  selectModel(model_id) {
    this.setState({ model_id });
  }

  selectOs(os_id) {
    this.setState({ os_id });
  }

  selectOsVersion(os_version_id) {
    this.props.fetchArchPrs({
      profile_name: this.props.match.params.profile_name,
      device_id: this.state.device_id,
      model_id: this.state.model_id,
      os_id: this.state.os_id,
      os_version_id: os_version_id
    });
    this.props.fetchOsPanelPrs({
      profile_name: this.props.match.params.profile_name,
      device_id: this.state.device_id,
      model_id: this.state.model_id,
      os_id: this.state.os_id,
      os_version_id: os_version_id
    });
    this.setState({ os_version_id });
  }

  selectBrowser(browser_id) {
    this.setState({ browser_id });
  }

  afterFetchAction(type) {
    return nextId => {
      const {
        onDeviceRowClick,
        onModelRowClick,
        onOsRowClick,
        onOsVersionRowClick,
        onBrowserRowClick,
        fetchArchPrs,
        fetchOsPanelPrs
      } = this.props;

      const { id } = this.props[type].priorities[0];
      return () => {
        switch (type) {
          case "devices": {
            onDeviceRowClick(
              id,
              this.selectDevice,
              this.afterFetchAction("models")
            )();
            break;
          }

          case "models": {
            onModelRowClick(
              id,
              nextId,
              this.selectModel,
              this.afterFetchAction("oses")
            )();
            break;
          }

          case "oses": {
            return onOsRowClick(
              id,
              this.state.device_id,
              nextId,
              this.selectOs,
              this.afterFetchAction("os_versions")
            )();
          }

          case "os_versions": {
            fetchArchPrs({
              profile_name: this.props.match.params.profile_name,
              device_id: this.state.device_id,
              model_id: this.state.model_id,
              os_id: this.state.os_id,
              os_version_id: id
            });
            fetchOsPanelPrs({
              profile_name: this.props.match.params.profile_name,
              device_id: this.state.device_id,
              model_id: this.state.model_id,
              os_id: this.state.os_id,
              os_version_id: id
            });
            return onOsVersionRowClick(
              id,
              this.state.device_id,
              this.state.model_id,
              nextId,
              this.selectOsVersion,
              this.afterFetchAction("browsers", id)
            )();
          }

          case "browsers": {
            onBrowserRowClick(
              id,
              this.state.device_id,
              this.state.model_id,
              this.state.os_id,
              nextId,
              this.selectBrowser,
              this.afterFetchAction("browser_versions")
            )();
            break;
          }
          case "browser_versions": {
            this.selectBrowserVersion(id)();
            break;
          }
        }
      };
    };
  }

  selectBrowserVersion(browser_version_id) {
    return () => this.setState({ browser_version_id });
  }

  getFirstThird() {
    const { devices, models } = this.props;
    const { onDeviceRowClick, onModelRowClick } = this.props;
    const head = [
      <th key={0}>{`Devices(${devices.priorities.length})`}</th>,
      <th key={1}>{`Models(${models.priorities.length})`}</th>
    ];
    const rows = [
      {
        singleItemName: "Device",
        nameAddAttr: "add-device",
        addBtnText: "Add Device",
        handleOnClick: this.openDeviceModal,
        rows: devices.priorities.map((elm, index) => (
          <SmallTableRow
            {...elm}
            key={index}
            rowKey={index}
            action={onDeviceRowClick(
              elm.id,
              this.selectDevice,
              this.afterFetchAction("models")
            )}
            isActive={elm.id === this.state.device_id}
          />
        ))
      },
      {
        singleItemName: "Model",
        nameAddAttr: "add-model",
        addBtnText: "Add Model",
        handleOnClick: this.openModelModal,
        rows: models.priorities.map((elm, index) => (
          <BigTableRow
            {...elm}
            rowKey={index}
            key={index}
            action={onModelRowClick(
              elm.id,
              this.state.device_id,
              this.selectModel,
              this.afterFetchAction("oses")
            )}
            isActive={elm.id === this.state.model_id}
          />
        ))
      }
    ];
    return <ThirdPart headRow={head} rows={rows} />;
  }

  getSecondThird() {
    const { oses, os_versions, onOsRowClick, onOsVersionRowClick } = this.props;

    const head = [
      <th key={0}>{`Oses(${oses.priorities.length})`}</th>,
      <th key={1}>{`OS Versions(${os_versions.priorities.length})`}</th>
    ];
    const rows = [
      {
        singleItemName: "OS",
        nameAddAttr: "add-os",
        addBtnText: "Add OS",
        handleOnClick: this.openOsModal,
        rows: oses.priorities.map((elm, index) => (
          <SmallTableRow
            {...elm}
            key={index}
            rowKey={index}
            action={onOsRowClick(
              elm.id,
              this.state.device_id,
              this.state.model_id,
              this.selectOs,
              this.afterFetchAction("os_versions")
            )}
            isActive={elm.id === this.state.os_id}
          />
        ))
      },
      {
        singleItemName: "OS Version",
        nameAddAttr: "add-os-version",
        addBtnText: "Add OS Version",
        handleOnClick: this.openOsVersionModal,
        rows: os_versions.priorities.map((elm, index) => (
          <BigTableRow
            {...elm}
            key={index}
            rowKey={index}
            action={onOsVersionRowClick(
              elm.id,
              this.state.device_id,
              this.state.model_id,
              this.state.os_id,
              this.selectOsVersion,
              this.afterFetchAction("browsers", elm.id)
            )}
            isActive={elm.id === this.state.os_version_id}
            handleDetailClick={this.openDetailOsVersion}
          />
        ))
      }
    ];

    return <ThirdPart headRow={head} rows={rows} />;
  }

  getLastThird() {
    const { browsers, browser_versions, onBrowserRowClick } = this.props;
    const head = [
      <th key={0}>{`Browsers(${browsers.priorities.length})`}</th>,
      <th key={1}>
        {`Browser Versions(${browser_versions.priorities.length})`}
      </th>
    ];
    const rows = [
      {
        singleItemName: "Browser",
        nameAddAttr: "add-browser",
        addBtnText: "Add Browser",
        handleOnClick: this.openBrowserModal,
        rows: browsers.priorities.map((elm, index) => (
          <SmallTableRow
            {...elm}
            key={index}
            rowKey={index}
            action={onBrowserRowClick(
              elm.id,
              this.state.device_id,
              this.state.model_id,
              this.state.os_id,
              this.state.os_version_id,
              this.selectBrowser,
              this.afterFetchAction("browser_versions")
            )}
            isActive={elm.id === this.state.browser_id}
          />
        ))
      },
      {
        singleItemName: "Browser Version",
        nameAddAttr: "add-browser-version",
        addBtnText: "Add Browser Version",
        handleOnClick: this.openBrowserVersionModal,
        rows: browser_versions.priorities.map((elm, index) => (
          <BigTableRow
            {...elm}
            key={index}
            rowKey={index}
            action={this.selectBrowserVersion(elm.id)}
            isActive={elm.id === this.state.browser_version_id}
          />
        ))
      }
    ];
    return <ThirdPart headRow={head} rows={rows} />;
  }

  getCurrentTypeItems() {
    return this.state.currentType
      ? this.props[this.state.currentType].items
      : [];
  }

  getDetailModals() {
    const { archs, os_versions, os_panels } = this.props;
    const DetailOsVersionHeadRow = [
      <th key={0}>{`Архитектуры (${archs.priorities.length})`}</th>,
      <th key={1}>{`Панели ОС(${os_panels.priorities.length})`}</th>
    ];
    const rows = [
      {
        singleItemName: "Архитектура",
        secondItemName: "Содержание",
        addBtnText: "Добавить Архитектуру",
        handleOnClick: this.openArchModal,
        rows: archs.priorities.map((elm, index) => (
          <SmallTableRow {...elm} key={index} rowKey={index} />
        ))
      },
      {
        singleItemName: "Высота",
        addBtnText: "Добавить панель",
        handleOnClick: null,
        rows: os_panels.priorities.map((elm, index) => (
          <SmallTableRow {...elm} key={index} rowKey={index} />
        ))
      }
    ];
    return (
      <DetailModal
        show={this.state.showDetailOsVersion}
        onClose={this.hideModals}
        title="Свойства версии ОС"
        name={this.state.os_version_id || ""}
      >
        <ThirdPart headRow={DetailOsVersionHeadRow} rows={rows} />
      </DetailModal>
    );
  }

  getModals() {
    return (
      <div>
        <AddPriorityModal
          show={this.state.showDeviceModal}
          onClose={this.hideModals}
          name="Устройство"
          items={this.getCurrentTypeItems()}
          action={null}
          fieldName="device_id"
        />
        <AddPriorityModal
          show={this.state.showModelModal}
          onClose={this.hideModals}
          name="Модель"
          items={this.getCurrentTypeItems()}
          action={null}
          fieldName="model_id"
        />
        <AddPriorityModal
          show={this.state.showOsModal}
          onClose={this.hideModals}
          name="Операционка"
          items={this.getCurrentTypeItems()}
          action={null}
          fieldName="os_id"
        />
        <AddPriorityModal
          show={this.state.showOsVersionModal}
          onClose={this.hideModals}
          name="Версия Операционки"
          items={this.getCurrentTypeItems()}
          action={null}
          fieldName="os_version_id"
        />
        <AddPriorityModal
          show={this.state.showBrowserModal}
          onClose={this.hideModals}
          name="Браузер"
          items={this.getCurrentTypeItems()}
          action={null}
          fieldName="browser_id"
        />
        <AddPriorityModal
          show={this.state.showBrowserVersionModal}
          onClose={this.hideModals}
          name="Версия Бразуера"
          items={this.getCurrentTypeItems()}
          actin={null}
          fieldName="browser_version_id"
        />
        <AddPriorityModal
          show={this.state.showArchModal}
          onClose={this.hideArchModal}
          name="Архитектура"
          items={this.getCurrentTypeItems()}
          action={null}
          fieldName="arch_id"
        />

      </div>
    );
  }

  render() {
    return (
      <div>
        {this.getModals()}
        {this.getDetailModals()}
        <table className="table table-three">
          <thead className="table-three-root">
            <tr>
              <th>Устройства</th>
              <th>Операционные системы</th>
              <th>Браузеры</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              {this.getFirstThird()}
              {this.getSecondThird()}
              {this.getLastThird()}
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default TableDistribution;
