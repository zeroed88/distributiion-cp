import React from "react";
import { connect } from "react-redux";
import TableView from "../../components/TableView";
import { getOsVersions } from "../../reducers/os_versions";
import { fetchRemoveOSVersions } from "../../actions/os_versions";
import { getOsById } from "../../reducers/oses";
import AddOsVerisionForm from "./form";
import ButtonBlock from "../../components/ButtonOptions";

const TableRow = props => {
  const { elm, os, onRemove } = props;
  return (
    <tr key={elm.id}>
      <td className="id">{elm.id}</td>
      <td>{os.name} </td>
      <td>{elm.name}</td>
      <td>{elm.payload}</td>
      <td>{elm.build}</td>
      <ButtonBlock onRemoveClick={onRemove([elm.id])} />
    </tr>
  );
};

const EditOsVersions = props => {
  const rows = props.items.map(elm => (
    <TableRow
      elm={elm}
      onRemove={ids => () => props.dispatch(fetchRemoveOSVersions(ids))}
      os={props.osById(elm.os_id)}
    />
  ));

  return (
    <TableView
      title="Управление версиями ОС"
      createBtnLabel="Создать версию ОС"
      headRow={["#", "ОС", "Версия", "Содержание", "Билд"]}
      rows={rows}
      specialForm={AddOsVerisionForm}
    />
  );
};

function mapStateToProps(state) {
  return {
    items: getOsVersions(state),
    osById: getOsById(state)
  };
}

export default connect(mapStateToProps)(EditOsVersions);
