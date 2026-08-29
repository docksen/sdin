package com.zuttokin.rose.data.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * User info
 *
 * @author Docksen
 * @since 2026-08-29 11:53:41 +0800
 */
@Data
@TableName("user")
public class UserDataEntity implements Serializable {

    @Serial
    private static final long serialVersionUID = 923200276887297849L;

    /**
     * Primary key
     */
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    /**
     * Optimistic lock version
     */
    @Version
    @TableField("version")
    private Integer version;

    /**
     * Deletion status (0: active, 1: deleted)
     */
    @TableField("is_deleted")
    private Boolean deleted;

    /**
     * Create time
     */
    @TableField("create_time")
    private LocalDateTime createTime;

    /**
     * Last update time
     */
    @TableField("update_time")
    private LocalDateTime updateTime;

    /**
     * Username
     */
    @TableField("username")
    private String username;

    /**
     * Password
     */
    @TableField("password")
    private String password;

    /**
     * Email
     */
    @TableField("email")
    private String email;

}
