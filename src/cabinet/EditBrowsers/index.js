import React from "react";
import { connect } from "react-redux";
import TableView from "../../components/TableView";
import { fetchRemoveBrowsers } from "../../actions/browsers";
import { getBrowsers } from "../../reducers/browsers";
import AddBrowserForm from "./form";
import ButtonBlock from "../../components/ButtonOptions";

const TableRow = props => {
  const { elm, os, version, onRemove } = props;
  return (
    <tr key={elm.id}>
      <td className="id">{elm.id}</td>
      <td>{elm.name}</td>
      <td>{elm.template}</td>
      <ButtonBlock onRemoveClick={onRemove([elm.id])} />
    </tr>
  );
};

const EditBrowsers = props => {
  const rows = props.items.map(elm => (
    <TableRow
      elm={elm}
      onRemove={ids => () => props.dispatch(fetchRemoveBrowsers(ids))}
    />
  ));

  return (
    <TableView
      title="Edit Browsers"
      createBtnLabel="Create Browser"
      headRow={["#", "Имя браузера", "Шаблон"]}
      rows={rows}
      specialForm={AddBrowserForm}
    />
  );
};

function mapStateToProps(state) {
  return {
    items: getBrowsers(state)
  };
}

export default connect(mapStateToProps)(EditBrowsers);
