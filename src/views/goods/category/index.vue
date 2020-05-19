<template>
  <div class="category">
    <div>
      <el-button @click="deleteAll">批量删除</el-button>
      <el-button @click="addParentItem">添加分类</el-button>
      <el-button @click="saveCategory">保存更改</el-button>
    </div>
    <div class="table">
      <ul class="title">
        <li class="width-5"><input type="checkbox" v-model="allSelect" @change="handleAll"></li>
        <li class="width-30">分类名称</li>
        <li class="width-15">排序</li>
        <li class="width-15">创建时间</li>
        <li class="width-15">修改时间</li>
        <li class="width-20">操作</li>
      </ul>
      <div class="body">
        <div class="parent" v-for="(items,key) in list" :key="key">
          <ul class="item">
            <li class="width-5">
              <input type="checkbox" v-model="items.select" @click="handleParent(key)">
            </li>
            <li class="width-30">
              <i :class="!items.show?'el-icon-caret-right':'el-icon-caret-bottom'" @click="showChild(key)"></i>
              <input type="text" v-model="items.name">
            </li>
            <li class="width-15">
              <i class="el-icon-download rotate180" @click="parentMoveTop(key)"></i>
              <i class="el-icon-arrow-up" @click="parentMoveUp(key)"></i>
              <i class="el-icon-arrow-down" @click="parentMoveDown(key)"></i>
              <i class="el-icon-download" @click="parentMoveBottom(key)"></i>
            </li>
            <li class="width-15">{{items.created_at}}</li>
            <li class="width-15">{{items.updated_at}}</li>
            <li class="width-20">
              <el-button size="mini" @click="deleteParent(key)">删除</el-button>
              <el-button size="mini" @click="goToList(items.id)">查看</el-button>
              <el-button size="mini" @click="addChildItem(key)">添加子分类</el-button>
            </li>
          </ul>
          <div class="child" v-show="items.show">
            <ul class="item" v-for="(item,childKey) in items.children" :key="childKey">
              <li class="width-5">
                <input type="checkbox"  v-model="item.select" @change="handleChild(key)">
              </li>
              <li class="width-30">
                <i class="el-icon-minus"></i>
                <input type="text" v-model="item.name">
              </li>
              <li class="width-15">
                <i class="el-icon-download rotate180" @click="childMoveTop(key,childKey)"></i>
                <i class="el-icon-arrow-up" @click="childMoveUp(key,childKey)"></i>
                <i class="el-icon-arrow-down" @click="childMoveDown(key,childKey)"></i>
                <i class="el-icon-download" @click="childMoveBottom(key,childKey)"></i>
              </li>
              <li class="width-15">{{item.created_at}}</li>
              <li class="width-15">{{item.updated_at}}</li>
              <li class="width-20">
                <el-button size="mini" @click="deleteChild(key,childKey)">删除</el-button>
                <el-button size="mini" @click="goToList(item.id)">查看</el-button>
              </li>
            </ul>
          </div>
        </div>
        
      </div>
    </div>
  </div>
</template>

<script>
import goods from '@/api/goods'

export default {
  data () {
    return {
      allSelect: false,
      list: [],
      oldList:[],
      deleteList: []
    }
  },
  methods: {
    goToList(id){
      this.$router.push({path:`/goods-manage/goods/manage/sale?category_id=${id}`})
    },
    handleAll(){
      let status = this.allSelect
      this.list.map((item)=>{
        item.select = status
        item.children.map((child)=>{
          child.select = status
        })
      })
    },
    handleParent(key){
      let status = this.list[key].select
      this.list[key].children.map((item)=>{
        item.select = !status
      })
    },
    handleChild(key){
      let isAll =  this.list[key].children.some((item)=>{
        return item.select == false
      })

      if(isAll){
        this.list[key].select = false
        this.allSelect = false
      }
      
    },
    deleteAll(){
      this.list.map((item) => {
        item.children = item.children.filter((child) => {
          if(child.select&&child.id){
            this.deleteList.push(child.id)
          }
          return child.select == false
        })
        
        item.children.map((child,index) => {
          child.sort = index
        })
      })

      this.list = this.list.filter((item)=>{
        if(item.select&&item.id){
          this.deleteList.push(item.id)
        }
        return item.select == false
      })

      this.list.map((item,index) => {
        item.sort = index
      })

      this.allSelect = false
      
    },
    addParentItem(){
      let length = this.list.length
      this.list.push({
        name:'',
        sort:length,
        show:false,
        children:[]
      })
    },
    deleteParent(key){
      let length = this.list.length
      let isChild = this.list[key].children.length
      
      if(isChild){
        this.$message({
          message: '该分类下有子分类！',
          type: 'error'
        });
        return 
      }

      if(this.list[key].id){
        this.deleteList.push(this.list[key].id)
      }

      this.list.splice(key,1)


      //如果是不是最后一个
      if(key !== length){
        for(let i=key;i<length-1;i++){
          this.list[i].sort = i
        }
      }
    },
    deleteChild(key,childKey){
      let children = this.list[key].children
      let length = children.length
      
      if(children[childKey].id){
        this.deleteList.push(children[childKey].id)
      }
      
      children.splice(childKey,1)
      //如果是不是最后一个
      if(childKey !== length){
        for(let i=childKey;i<length-1;i++){
          children[i].sort = i
        }
      }
    },
    addChildItem(key){
      this.list[key].show = true
      let length = this.list[key].children.length
      this.list[key].children.push({
        name:"",
        sort: length
      })
    },
    showChild(key){
      this.list[key].show = !this.list[key].show
    },
    parentMoveTop(key){
      if(key==0){
        return
      }
      for(let i =key;i>0;i--){
        this.parentMoveUp(i)
      }
    },
    parentMoveUp(key){
      if(key==0){
        return
      }
      let flag = this.list[key]
      this.list.splice(key,1,this.list[key-1])
      this.list.splice(key-1,1,flag)

      this.list[key].sort += 1
      this.list[key-1].sort -= 1
    },
    parentMoveDown(key){
      if(key==this.list.length-1){
        return
      }
      let flag = this.list[key]
      this.list.splice(key,1,this.list[key+1])
      this.list.splice(key+1,1,flag)

      this.list[key].sort -= 1
      this.list[key+1].sort += 1
    },
    parentMoveBottom(key){
      if(key==this.list.length-1){
        return
      }

      for(let i=key; i<this.list.length-1; i++) {
        this.parentMoveDown(i)
      }
    },
    childMoveTop(key,childKey){
      if(childKey==0){
        return
      }
      for(let i=childKey; i>0;i--){
        this.childMoveUp(key,i)
      }
    },
    childMoveUp(key,childKey){
      if(childKey==0){
        return
      }
      let children = this.list[key].children
      let flag = children[childKey]
      children.splice(childKey,1,children[childKey-1])
      children.splice(childKey-1,1,flag)

      children[childKey].sort += 1
      children[childKey-1].sort -= 1
    },
    childMoveDown(key,childKey){
      let children = this.list[key].children
      if(childKey==children.length-1){
        return
      }
      let flag = children[childKey]
      children.splice(childKey,1,children[childKey+1])
      children.splice(childKey+1,1,flag)

      children[childKey].sort -= 1
      children[childKey+1].sort += 1
    },
    childMoveBottom(key,childKey){
      let children = this.list[key].children
      if(childKey==children.length-1){
        return
      }

      for(let i=childKey; i<children.length-1; i++){
        this.childMoveDown(key,i)
      }
    },
    saveCategory(){
      let params = {
        cat_data: this.list,
        origin_cat_data: this.oldList,
        delete_cat_ids: this.deleteList
      }

      goods.saveCategory(params).then((res)=>{
        if(res.code==0){
          this.$message({
            type:'success',
            message:'保存成功'
          })
          this.getCategory()
        }
      })
    },
    getCategory(){
      goods.getCategory().then((res) => {
        if(res.code===0){
          this.oldList = JSON.parse(JSON.stringify(res.data))
          this.list = []
          this.deleteList = []
          this.allSelect = false

          for(let i in res.data){
            this.list.push(res.data[i])
            let index = this.list.length-1

            this.$set(this.list[index],"show",false)
            this.$set(this.list[index],"select",false)
            let child = []
            if(this.list[index].children){
              for(let j in this.list[index].children){
                child.push(this.list[index].children[j])
                this.$set(this.list[index].children[j],"select",false)
              }

              child.sort(function (a, b) {
                return a.sort - b.sort
              })
            }

            this.$set(this.list[index],"children",child)
          }
          this.list.sort(function(a, b) {
            return a.sort - b.sort
          })
        }
      })
    }
  },
  created () {
    this.getCategory()
  }
}

</script>

<style lang='scss' scoped>
.width-5{
  width: 5%;
}
.width-15{
  width: 15%;
}
.width-20{
  width: 20%;
}
.width-30{
  width: 30%;
}

.rotate180{
  transform:rotate(180deg);
}

.category {
  margin: 20px;
  .table {
    margin-top: 10px;
    .title {
      overflow: hidden;
      background: #f5f7fa;
      color: #909399;
      border-left: 1px solid #ebeef5;
      li {
        float: left;
        text-align: center;
        height: 40px;
        line-height: 40px;
        border-bottom: 1px solid #ebeef5;
        border-right: 1px solid #ebeef5;
      }
    }
    .body {
      .parent {
        .item,
        .child .item {
          overflow: hidden;
          border-left: 1px solid #ebeef5;
          li {
            float: left;
            text-align: center;
            height: 40px;
            line-height: 40px;
            border-bottom: 1px solid #ebeef5;
            border-right: 1px solid #ebeef5;
            &:nth-child(2) {
              text-align: left;
            }
          }
        }
        .child {
          .item {
            li {
              &:nth-child(2) {
                text-align: left;
                padding-left: 20px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
