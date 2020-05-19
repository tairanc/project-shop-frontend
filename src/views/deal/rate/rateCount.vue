<template>
    <div>
         <div class="rateCount">
          <el-table
            :data="list"
            border
            center>
            <el-table-column
              prop="time"
              label=""></el-table-column>

              <el-table-column
              prop="good"
              label="好评"></el-table-column>

              <el-table-column
              prop="neutral"
              label="中评"></el-table-column>

                <el-table-column
              prop="bad"
              label="差评"></el-table-column>

              <el-table-column
              prop="total"
              label="总计"></el-table-column>
            
          </el-table>
         </div>
    </div>
</template>
<script>
import TableView from '@/components/TableView'
import comments from '@/api/deal/comments'

export default {
    data() {
        return {
            list:[],

            }
        },
    methods:{
        getCommentsData() {
            comments.getComments().then((res) => {
                this.list =[]
                let list =this.list;
                let data = res.data;
                for(let i in data){
                var time =data[i].time;
                switch(time){
                    case 'recentMonth':data[i].time='最近一个月';
                    break;

                    case 'recentWeek':data[i].time='最近一周';
                    break;

                    case 'sixMonth':data[i].time='最近六个月';
                    break;

                    case 'sixMonthAgo':data[i].time='六个月前';
                    break;

                    case 'total':data[i].time='总计';
                    break;
                    };
                    list.push(data[i]);
                }
            })
        },
    },
    components:{
        TableView
    },
    created:function(){
        this.getCommentsData()
    }
}
</script>

<style>
.rateCount{
    padding: 10px
}
.rateCount td{
    text-align: center
}
.rateCount th .cell{
    text-align: center
}
</style>

