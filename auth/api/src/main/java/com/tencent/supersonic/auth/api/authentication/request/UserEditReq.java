package com.tencent.supersonic.auth.api.authentication.request;


import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class UserEditReq {

    @NotBlank(message = "name can not be null")
    private String name;

    private String password;

    private String displayName;

    private String email;
}
