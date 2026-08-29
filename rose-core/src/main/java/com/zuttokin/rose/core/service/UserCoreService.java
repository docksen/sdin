package com.zuttokin.rose.core.service;

import com.zuttokin.rose.core.request.QueryUserInfoCoreRequest;
import com.zuttokin.rose.core.response.QueryUserInfoCoreResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

public interface UserCoreService {

    @Valid
    @NotNull
    QueryUserInfoCoreResponse queryUserInfo(@Valid @NotNull QueryUserInfoCoreRequest request);

}
