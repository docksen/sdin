package com.zuttokin.rose.api.service;

import com.zuttokin.rose.api.request.QueryUserInfoApiRequest;
import com.zuttokin.rose.api.response.QueryUserInfoApiResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

public interface UserService {

    @Valid
    @NotNull
    QueryUserInfoApiResponse queryUserInfo(@Valid @NotNull QueryUserInfoApiRequest request);

}
