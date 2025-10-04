import { SelectOption } from "../components/FormFields";
import { ChangeHandler, FieldConfigInput, FieldGroupConfig, FieldsConfig, FieldType } from "../types/fields_config";

export const createFieldsConfig = <T>(
    input: FieldConfigInput<T>,
    handlers?: Partial<ChangeHandler>,
    options?: Partial<Record<keyof T, SelectOption[]>>,
    groups?: Partial<Record<keyof T, FieldGroupConfig>>
): FieldsConfig<T> => {
    const config: FieldsConfig<T> = {} as FieldsConfig<T>;

    (Object.keys(input) as (keyof T)[]).forEach((fieldKey) => {
        const fieldType: FieldType = input[fieldKey].type;

        config[fieldKey] = {
            type: fieldType,
            onChangeHandler: handlers?.[fieldType],
            options: options?.[fieldKey],
            fieldGroup: groups?.[fieldKey],
        };
    });

    return config;
};
