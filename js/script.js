function addRow(){
    var table = document.getElementById("table");
    // console.log(table);
    var length = table.rows.length;
    // console.log(length);
    var newrow = table.insertRow(length);

    var namecol = newrow.insertCell(0);
    var contactcol = newrow.insertCell(1);
    var actioncol = newrow.insertCell(2);

    namecol.innerHTML = '新姓名';
    contactcol.innerHTML = '新联系方式';
    actioncol.innerHTML = `<button onclick="editRow(this)">编辑</button><button onclick="deleteRow(this)">删除</button>`;
    // console.log(newrow);
}

function deleteRow(button) {
    // console.log(button);
    var row = button.parentNode.parentNode;
    row.parentNode.removeChild(row);
}

function editRow(button) {
    // console.log(button);
    var row = button.parentNode.parentNode;
    var name = row.cells[0];
    var contact = row.cells[1];

    var inputName = prompt("请输入名字：")
    var inputPhone = prompt("请输入联系方式：")

    // 判空：null、undefined、空字符串都视为没输入
    if (!inputName || !inputPhone) {
        alert("增加失败：名字和联系方式均不能为空！");
        return;          // 提前终止，不修改 DOM
    }
    
    name.innerHTML = inputName;
    contact.innerHTML = inputPhone;

}