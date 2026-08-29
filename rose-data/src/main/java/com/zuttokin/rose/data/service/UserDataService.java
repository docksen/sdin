package com.zuttokin.rose.data.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.zuttokin.rose.data.entity.UserDataEntity;

public interface UserDataService extends IService<UserDataEntity> {

    UserDataEntity readUser();

}
