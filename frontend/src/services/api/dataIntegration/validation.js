import Joi from 'joi';
import responseApiMappings from '../schemas/validation/reponseMapping';
import requestApiMappings from '../schemas/validation/requestMapping';

export function generateRequestValidationSchema(operation) {
  const schemaConfig = requestApiMappings[operation].mappings;
  const schema = {};
  Object.keys(schemaConfig).forEach((key) => {
    const field = schemaConfig[key];
    schema[field.frontend] = field.validation;
  });
  return Joi.object(schema);
}

export async function validateRequestData(operation, frontendData) {
  const validationSchema = generateRequestValidationSchema(operation);
  try {
    const { value, error } = await validationSchema.validateAsync(frontendData);
    if (error)
      throw new Error(
        `Validation error: ${error.details.map((x) => x.message).join(', ')}`
      );
    return value;
  } catch (error) {
    console.error(
      `Unhandled validation error in operation ${operation}:`,
      error
    );
    throw error;
  }
}

export function generateResponseValidationSchema(operation) {
  const schemaConfig = responseApiMappings[operation].mappings;
  const schema = {};
  Object.keys(schemaConfig).forEach((key) => {
    const field = schemaConfig[key];
    schema[field.backend] = field.validation;
  });
  return Joi.object(schema);
}

export async function validateResponseData(operation, backendData) {
  const validationSchema = generateResponseValidationSchema(operation);
  try {
    const value = await validationSchema.validateAsync(backendData);
    return value;
  } catch (error) {
    console.error(
      `Unhandled validation error in operation ${operation}:`,
      error
    );
    throw error;
  }
}
