<template>
  <div>
    <el-table
      :data="tableData"
      style="width: 100%"
      border
      stripe
      empty-text="无预约信息"
      ref="listSubscribeTable"
    >
      <el-table-column label="预约操作数" align="center">
        <template slot-scope="scope">
          <span
            :class="scope.row.subscribeChangeNum<0?'lessThanZero':'greaterThanZero'"
          >{{scope.row.subscribeChangeNum}}</span>
        </template>
      </el-table-column>
      <el-table-column label="预约时间" width="200" align="center">
        <template slot-scope="scope">{{dateFormat(scope.row.subscribeChangeTime)}}</template>
      </el-table-column>
      <el-table-column prop="subscribeChangeUserName" label="对接人姓名" align="center"></el-table-column>
      <el-table-column prop="subscribeChangeUserPhone" label="对接人联系方式" align="center"></el-table-column>
      <el-table-column prop="subscribeChangeAddress" label="对接人地址" align="center"></el-table-column>
      <el-table-column prop="des" label="备注" align="center"></el-table-column>
      <el-table-column label="操作" align="center" width="175px">
        <template slot-scope="scope">
          <template v-if="!scope.row.subscribeState">
            <el-button :disabled="true">无可用操作</el-button>
          </template>
          <template v-else>
            <el-button type="info" @click="tellParentShowEditSubscibeDialog(scope.row)">编辑</el-button>
            <el-button
              :class="checkTimeClass(scope)"
              @click="handleSubmitSubscribe(scope)"
              :type="checkTimeType(scope)"
            >完成</el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { submitSubscribe } from "@/request/api.js";

export default {
  props: ["tableData", "waitChangeStockId"],
  data() {
    return {};
  },
  methods: {
    tellParentShowEditSubscibeDialog(row) {
      this.$emit("tellParentShowEditSubscibeDialog", row);
    },
    // 提交预约操作
    handleSubmitSubscribe(scope) {
      this.$confirm("请确认这是您的本意, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // 重写需要修改的stockid，原因:原先数据的stockid不是用来实现预约的，会出错
          scope.row.filed1 = scope.row.stockId; // 保留原先的字段 防止出现异常
          scope.row.stockId = this.waitChangeStockId[0].id;
          submitSubscribe({
            subscribeJson: JSON.stringify(scope.row)
          }).then(res => {
            if (res.status == 1) {
              this.$message.success(res.data);
              // 删除表格
              this.tableData.splice(scope.$index, 1);
              // 重新刷新stock那行记录
              this.$emit("submitSubscribeTellParentReloadStock");
            } else {
              this.$message.error(res.data);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作"
          });
        });
    },
    /** 工具方法*/
    dateFormat(time) {
      let tempDate = new Date(time);
      let date = new Date(tempDate.valueOf() - 0 * 60 * 60 * 1000); // 当前时间减掉0小时
      return date.toLocaleString();
    },
    checkTimeType(scope) {
      switch (this.confirmSubscribeTimeRead(scope)) {
        case 1:
          return "warning";
          break;
        case 0:
          return "danger";
        default:
          return "success";
          break;
      }
    },
    checkTimeClass(scope) {
      switch (this.confirmSubscribeTimeRead(scope)) {
        case 1:
          return "animated infinite pulse slow";
          break;
        case 0:
          return "animated infinite pulse faster";
        default:
          return "";
          break;
      }
    },
    confirmSubscribeTimeRead(scope) {
      let timestamp =
        new Date(scope.row.subscribeChangeTime).getTime() -
        new Date().getTime();
      let days = timestamp / 1000 / 60 / 60 / 24; // 如果期限小于3天，作出提醒
      if (days < 3 && days > 0) {
        return 1; // 代表三天内
        // return "animated infinite pulse slow";
      } else if (days < 0) {
        return 0; // 代表超时
        // return "animated infinite pulse faster";
      }
      return -1; // 代表没事
    }
  }
};
</script>
<style scoped>
.greaterThanZero {
  font-weight: bold;
}
.lessThanZero {
  font-weight: bold;
  color: #f56c6c;
}
</style>