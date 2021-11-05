<template>
  <div>
    <van-sticky>
      <van-nav-bar @click-left="goBackHandle">
        <template #left>
          <van-icon name="arrow-left"  size="24" color="#8B8989"/>
        </template>
        <template #title>Task</template>
      </van-nav-bar>
    </van-sticky>
    <scroll-view class="scrollCommonHeightView">
      <div class="promotion-list-content">
        <div class="list-inner">
          <template  v-if="$route.query.type==1">
            <div class="list-inner-title">
              Rewards standard
            </div>
            <div class="list-inner-from">
              <table border="1">
                <thead>
                <tr class="text-align">
                  <th>Level</th>
                  <th>Number of successful activations monthly</th>
                  <th>Unit price(R)</th>
                  <th>Rewards(R)</th>
                </tr>
                </thead>
                <tbody>
                <tr class="text-align">
                  <td>Level 1</td>
                  <td>[0,100)</td>
                  <td>5</td>
                  <td>Up to 500</td>
                </tr>
                <tr class="text-align">
                  <td>Level 2</td>
                  <td>[100,200)</td>
                  <td>5.5</td>
                  <td>550-1,100</td>
                </tr>
                <tr class="text-align">
                  <td>Level 3</td>
                  <td>[200,300)</td>
                  <td>6</td>
                  <td>1,200-1,800</td>
                </tr>
                <tr class="text-align">
                  <td>Level 4</td>
                  <td>[300,400)</td>
                  <td>7</td>
                  <td>2,100-2,800</td>
                </tr>
                <tr class="text-align">
                  <td>Level 5</td>
                  <td>[400,500)</td>
                  <td>8</td>
                  <td>3,200-4,000</td>
                </tr>
                <tr class="text-align">
                  <td>Level 6</td>
                  <td>[500,600)</td>
                  <td>9</td>
                  <td>4,500-5,400</td>
                </tr>
                <tr class="text-align">
                  <td>Level 7</td>
                  <td>[600,2300]</td>
                  <td>10</td>
                  <td>Up to 23,000</td>
                </tr>
                </tbody>
              </table>
              <van-notice-bar
                color="#2a2a2a"
                background="#fff"
                :scrollable="false"
                wrapable
                text="Rewards=Number of successful activations in the month * The
							corresponding unit price"
              />
              <van-notice-bar
                color="#2a2a2a"
                background="#fff"
                :scrollable="false"
                wrapable
                text="For example: In February.Number of successful activations
							is 291, so the Unit price is 6,the Rewards is 291*6=R1,746"
              />
            </div>
          </template>
          <template  v-else>
            <div class="g_mb_m">◇Todo 1：Phone number verified</div>
            <div>◇Todo 2：Complete the questionnaire</div>
          </template>

        </div>

      </div>
    </scroll-view>
  </div>
</template>

<script>
  import ScrollView from "@/components/common/ScrollView";
  export default {
    head(){
      return {
        title:'Promotion  - shopshipshake'
      }
    },
    name: "index",
    components:{ScrollView},
    methods:{
      goBackHandle(){
        this.$router.back()
      }
    }
  }
</script>

<style scoped lang="less">
  .icon-kaitongxuzhi{
    font-size:22px;
    color:#FCC900;
  }
  .scrollCommonHeightView{
    background-color: #eee;
  }
  .promotion-list-content{
    padding:10px 15px;
    .list-inner{
      background: #fff;
      padding:15px;
      border-radius: 6px;
      font-size:14px;
      line-height:1.6;
      .list-inner-title{
        font-size:16px;
        padding-bottom: 8px;
      }
      /deep/.van-row{
        border-bottom:1px solid #EEEEED;
      }
      /deep/.van-col{
        border-right: 1px solid #EEEEED;
      }
      .table-bordered{
        border:1px solid #EBEBEB;
      }
      table{
        border-collapse: collapse;
        border-spacing: 0;
        border-color: #EBEBEB;
        th{
          padding:0 4px;
          background:#F5F5F6;
          font-weight: normal;
          border-right:1px solid #EBEBEB;
          font-size:15px;
        }
        td{
          font-size:13px;
          padding:3px 5px;
        }
      }
    }
  }
</style>
