package com.tencent.supersonic.chat.api.pojo.request;

import lombok.Data;
import lombok.ToString;

@Data
public class ItemNameVisibility {

    private ItemNameVisibilityInfo aggVisibilityInfo;

    private ItemNameVisibilityInfo detailVisibilityInfo;
}
