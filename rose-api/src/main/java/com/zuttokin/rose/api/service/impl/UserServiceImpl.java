package com.zuttokin.rose.api.service.impl;

import com.zuttokin.rose.api.request.QueryUserInfoApiRequest;
import com.zuttokin.rose.api.response.QueryUserInfoApiResponse;
import com.zuttokin.rose.api.service.UserService;
import org.springframework.stereotype.Controller;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Validated
@Controller
@RequestMapping("/api/user")
public class UserServiceImpl implements UserService {

    @ResponseBody
    @PostMapping("/query-user-info")
    public QueryUserInfoApiResponse queryUserInfo(@RequestBody QueryUserInfoApiRequest request) {
        return new QueryUserInfoApiResponse();
    }

}
