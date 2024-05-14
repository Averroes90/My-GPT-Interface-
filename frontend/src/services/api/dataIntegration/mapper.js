import requestApiMappings from '../schemas/validation/requestMapping';
import responseApiMappings from '../schemas/validation/reponseMapping';

export function mapRequestData(operation, validatedData) {
  const mappingConfig = requestApiMappings[operation].mappings;
  const backendData = {};
  Object.keys(mappingConfig).forEach((key) => {
    const mappingInfo = mappingConfig[key];
    backendData[mappingInfo.backend] = validatedData[mappingInfo.frontend];
  });
  return backendData;
}
export function mapResponseData(operation, validatedData) {
  const mappingConfig = responseApiMappings[operation].mappings;
  const frontendData = {};
  Object.keys(mappingConfig).forEach((key) => {
    const mappingInfo = mappingConfig[key];
    frontendData[mappingInfo.frontend] = validatedData[mappingInfo.backend];
    console.log(mappingInfo.frontend);
  });
  return frontendData;
}
