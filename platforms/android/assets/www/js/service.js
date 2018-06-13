var StoreData=function(){
    var storage = window.localStorage;
    var data={
    setData:function(val){
        window.localStorage.setItem("water",JSON.stringify(val));
    },
    getData:function(){
       return JSON.parse(window.localStorage.getItem("water"));
    }
    }
    return data;
}