package com.zuttokin.rose.core.service.impl;

import com.zuttokin.rose.core.request.QueryUserInfoCoreRequest;
import com.zuttokin.rose.core.response.QueryUserInfoCoreResponse;
import com.zuttokin.rose.core.service.UserCoreService;
import com.zuttokin.rose.data.service.UserDataService;
import org.springframework.stereotype.Service;

@Service
public class UserCoreServiceImpl implements UserCoreService {

    private UserDataService userDataService;

    @Override
    public QueryUserInfoCoreResponse queryUserInfo(QueryUserInfoCoreRequest request) {
        userDataService.
        return null;
    }

}
