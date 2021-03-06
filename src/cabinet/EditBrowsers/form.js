import R from "ramda";
import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { reduxForm } from "redux-form";
import FormField from "../../components/FormField";
import FormSelectField from "../../components/FormSelectField";
import { fetchAddBrowser } from "../../actions/browsers";
import { getOses } from "../../reducers/oses";
import { getOsVersions } from "../../reducers/os_versions";

let AddBrowserForm = props => {
  const { handleSubmit, pristine, submitting, error } = props;
  const closeForm = () => {
    props.closeForm();
    props.destroy();
  };
  const submitForm = values => {
    const myValues = R.omit(["os_id"], values);
    return props.dispatch(
      fetchAddBrowser(
        { ...myValues, ...{ os_version_id: Number(myValues.os_version_id) } },
        closeForm
      )
    );
  };

  return (
    <div className="popup-content">
      <form className="form" onSubmit={handleSubmit(submitForm)}>
        <FormField
          name="name"
          type="text"
          label="Browser name"
          autoComplete="off"
        />
        <div className="popup-bottom">
          <button
            className="btn btn-success"
            disabled={pristine || submitting}
            type="submit"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

AddBrowserForm = reduxForm({
  form: "AddBrowserForm"
})(AddBrowserForm);

function mapStateToProps(state) {
  return {
    oses: getOses(state),
    os_versions: getOsVersions(state)
  };
}

export default connect(mapStateToProps)(AddBrowserForm);
