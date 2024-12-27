import PropTypes from "prop-types";

function PackageTemplate({ appName, appDescription, appStatus }) {
  return (
    <fieldset className='box column gap10'>
      <legend className='app-title'>{appName}</legend>
      <div className='content column aic jcsb gap10'>
        <p className='app-description noborder small'>{appDescription}</p>
        {appStatus}
      </div>
    </fieldset>
  );
}

PackageTemplate.propTypes = {
  appName: PropTypes.string.isRequired,
  appDescription: PropTypes.string.isRequired,
  appStatus: PropTypes.object.isRequired,
};

export default PackageTemplate;
