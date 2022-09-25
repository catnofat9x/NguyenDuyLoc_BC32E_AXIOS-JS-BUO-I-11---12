/**
 * Hàm này sẽ nhận vào 1 array (Product) và trả ra output là string <tr>....</tr>
 * @param {*} arrProduct arrProduct là mảng các object product [product1,product2,...]
 * @returns trả ra 1 giá trị là 1 htmlString '<tr>...</tr> <tr>...</tr>'
 */

function renderSanPham(arrProduct) { //param : input :arrProduct
    var html = ''; //output: string html 
    for (var i = 0; i < arrProduct.length; i++) {
        var sp = arrProduct[i]; //Mỗi lần duyệt lấy ra 1 object Product từ mảng {id:'1',name:'...',...}
        html += `
            <tr>
                <td>${sp.id}</td>
                <td><img style="width: 100%" src='${sp.img}' alt="Product image"></td>
                <td>${sp.name}</td>
                <td>${sp.price}</td>
                <td>${sp.description}</td>
                <td>${sp.type}</td>
                <td>
                    <button class="btn btn-danger mr-2" onclick="xoaSanPham('${sp.id}')"><i class="fa-solid fa-trash-can"></i></button>
                    <button class="btn btn-primary" onclick="chinhSua('${sp.id}')"><i class="fa-solid fa-pen-to-square"></i></button>
                </td>
            </tr>
        `;
    }
    document.querySelector('#tblProduct').innerHTML = html;
}

//GET: lấy dữ liệu từ server về
function layDanhSachSanPhamApi () {
    var promise = axios ({
        url:'http://svcy.myclass.vn/api/Product/GetAll',
        method:'GET'
    })

    //xử lí thành công
    promise.then(function(result){
        console.log(result.data);
        //Sau khi lấy dữ liệu từ backend về dùng dữ liệu đó tạo ra tr trên table sinh viên
        renderSanPham(result.data);
    })
    //xử lý thất bại
    promise.catch(function(err) {
        console.log(err);
    })
        
}
//gọi hàm lấy dữ liệu từ server khi trang web vừa load
window.onload = function () {
    layDanhSachSanPhamApi();
}

document.querySelector('#create').onclick = function () {
    var sp = new Product();
    //lấy thông tin người dùng từ giao diện nhập liệu
    sp.id = document.querySelector('#productID').value;
    sp.name = document.querySelector('#productName').value;
    sp.price = document.querySelector('#productPrice').value;
    sp.img = document.querySelector('#productImage').value;
    sp.type = document.querySelector('#productType').value;
    sp.description = document.querySelector('#productDesc').value;
    //  console.log(sp);

    //Gọi api đưa dữ liệu về backend
    var promise = axios ({
        url:'http://svcy.myclass.vn/api/Product/CreateProduct',
        method:'POST',
        data: sp //Dữ liệu gửi đi
    });

    promise.then(function(result) {
        console.log(result.data);
        //Gọi lại api lấy danh sách sản phẩm sau khi thêm thành công
        layDanhSachSanPhamApi();
    });

    promise.catch(function (error) {
        console.log(error)
    })
}
//----------------------------------- DEL : Xoá dữ liệu -----------------------------------------------

function xoaSanPham(idSPClick) {
    // alert(idSPClick);
    var promise = axios({
        url:'http://svcy.myclass.vn/api/Product/DeleteProduct/'+idSPClick,
        method:'DELETE'
    });

    //Thành công
    promise.then(function(result){
        console.log(result.data);
        //Gọi api lấy danh sách sinh viên sau khi xoá thành công => render lại table
        layDanhSachSanPhamApi();
    });
    //Thất bại
    promise.catch(function(err){
    })
}

function chinhSua(id) {
    var promise = axios({
        url:'http://svcy.myclass.vn/api/Product/GetById/'+id,
        method:'GET'
    });
    //Thành công 
    promise.then(function(result) {
        var sp = result.data;
        //Đem sinh viên load lên các thẻ
        document.querySelector('#productID').value = sp.id;
        document.querySelector('#productName').value = sp.name;
        document.querySelector('#productPrice').value = sp.price;
        document.querySelector('#productImage').value = sp.img;
        document.querySelector('#productType').value = sp.type;
        document.querySelector('#productDesc').value = sp.description;
    });
    //Thất bại
    promise.catch(function(error) {
        console.log(error)
    })
}

//-------------------------------- PUT: Cập nhật dữ liệu -----------------------------------------

document.querySelector('#update').onclick = function () {

    var spUpdate = new Product();
    spUpdate.id = document.querySelector('#productID').value;
    spUpdate.name = document.querySelector('#productName').value;
    spUpdate.price = document.querySelector('#productPrice').value;
    spUpdate.img = document.querySelector('#productImage').value;
    spUpdate.type = document.querySelector('#productType').value;
    spUpdate.description = document.querySelector('#productDesc').value;
    //Call api
    var promise = axios({
        url:'http://svcy.myclass.vn/api/Product/UpdateProduct/'+spUpdate.id,
        method:'PUT',
        data:spUpdate
    });

    promise.then(function(result){
        //Thành công
        console.log(result.data);
        layDanhSachSanPhamApi(); //Load lại table
    });

    promise.catch(function(err) {
        console.log(err);
    })

}

// tìm kiểm sản phẩm

document.querySelector('#btnTimKiem').onclick = function () {
    // alert('đang tìm kiếm!');
    // var arrProduct = Product();
    var searchName = document.querySelector('#nhapNameSP').value;
    var promise = axios({
        url:'http://svcy.myclass.vn/api/Product/SearchByName?name='+ searchName,
        method:'GET',
        data:searchName
    });

    promise.then(function(result){
        //Thành công
        console.log(result.data);
        // renderSPbyname(arrProduct,searchName);
        renderSanPham(result.data) //Load lại table
    });

    promise.catch(function(err) {
        console.log(err);
    })
}

// function renderSPbyname(arrSP,searchByName) {
//     var newSP = [];
//     var newArr = arrSP;
//     for (var index = 0; index < newArr.length; index++) {
//         var object = newArr[index];
//         var productName = object.name
//         if (productName = searchByName) {
//             newSP.push(newArr[index])
//         }
//     }
//     renderSanPham(newSP);
// }

// function dataBE (inputname) {
//     var mystring = inputname;
//     var arrayStrig = mystring.split(" ");
//     var newString = arrayStrig.join('%20');
//     return newString
// }
 
