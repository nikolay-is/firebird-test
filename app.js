let firebird = require ('node-firebird');
const windows1251 = require('windows-1251');
const utf8 = require('utf8');
let Iconv = require('iconv').Iconv;
var encoding = require ('encoding');

let options = {};

options.host = '127.0.0.1';
options.port = 3050;
//options.database = 'D:/Work/Web/firebird/test_none.mdb';
options.database = 'D:/Work/Web/firebird/TEST_1251_P.MDB';

options.user = 'profit';
options.password = '******';

let str = '';
let sql = '';
str = 'АБВ'; // <Buffer d0 90 d0 91 d0 92>  // 1040 1041 1042   //<Buffer c0 c1 c2>

firebird.attach(options, (err, db)=> {
    if (err) throw err;
    console.log(str + ' - str');
    db.query('Update NAMES set NAME_OP=? where ID_OP=? returning ID_OP, NAME_OP',[str, 3] , (err, result) =>{    
        if (err) throw err;
        console.log('.......updated row:')        
        console.log(result);
        console.log('.......returned data: ' + result.ID_OP + ' ' + result.NAME_OP);

        db.query('SELECT * FROM NAMES WHERE ID_OP=? OR ID_OP=? OR ID_OP=?', [1, 2, 3], function(err, rows) {
            if (err) throw err;
            console.log('.......all rows:')
            console.log(rows);
            rows.forEach(row => {
                console.log('.......returned data: ' +  row.ID_OP + ' ' + row.NAME_OP);
            });
            db.detach();
        });
    });
});


// Database charset is NONE
// https://github.com/hgourvest/node-firebird/pull/165

// .......all rows:
// [
//     {
//       ID_OP: 1,
//       NAME_OP: <Buffer 4b 69 72 69 6c 69 63 61 2d ca e8 f0 e8 eb e8 f6 e0>,
//       NUM_OP: 0,
//       DATE_OP: null
//     },
//     {
//       ID_OP: 2,
//       NAME_OP: <Buffer 4b 69 72 69 6c 69 63 61 2d ef bf bd ef bf bd ef bf bd ef bf bd ef bf bd ef bf bd ef bf bd ef bf bd>,
//       NUM_OP: 0,
//       DATE_OP: null
//     }
//   ]
//   .......returned data: 1 Kirilica-Кирилица
//   .......returned data: 2 Kirilica-пїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅ

// Other links
// https://www.npmjs.com/package/node-firebird
// https://github.com/hgourvest/node-firebird

// АБВ - str
// ÀÁÂ - windows1251.encode()
// ��� - from(windows1251.encode(str), 'binary')
// c0c1c2 - buf.toString('hex')
// NAME_OP= x'c0c1c2'
// .......updated row:
// { ID_OP: 3, NAME_OP: <Buffer c0 c1 c2> }
// .......returned data: 3 АБВ
// .......all rows:
// [
//   { ID_OP: 1, NAME_OP: <Buffer 41 42 43>, NUM_OP: 0, DATE_OP: null },
//   { ID_OP: 2, NAME_OP: <Buffer c0 c1 c2>, NUM_OP: 0, DATE_OP: null },
//   { ID_OP: 3, NAME_OP: <Buffer c0 c1 c2>, NUM_OP: 0, DATE_OP: null }
// ]
// .......returned data: 1 ABC
// .......returned data: 2 АБВ
// .......returned data: 3 АБВ

// D:\Work\Web\firebird>node app.js
// АБВ - str
// .......updated row:
// { ID_OP: 3, NAME_OP: 'АБВ' }
// .......returned data: 3 АБВ
// .......all rows:
// [
//   { ID_OP: 1, NAME_OP: 'ABC', NUM_OP: 0, DATE_OP: null },
//   { ID_OP: 2, NAME_OP: 'АБВ', NUM_OP: 0, DATE_OP: null },
//   { ID_OP: 3, NAME_OP: 'АБВ', NUM_OP: 0, DATE_OP: null }
// ]
// .......returned data: 1 ABC
// .......returned data: 2 АБВ
// .......returned data: 3 АБВ