import { LoginRequestDto } from "@/types/auth.types";
import {  FieldsConfig } from "@/types/fields_config";

export const loginFormConfig:FieldsConfig<LoginRequestDto> = {
      email:{
        type: 'email'},
      password:{type: 'password'}
    }