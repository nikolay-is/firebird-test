let firebird = require ('node-firebird');
const windows1251 = require('windows-1251');

let options = {};

options.host = '127.0.0.1';
options.port = 3050;
options.database = 'D:/Work/Web/firebird/test.mdb';
options.user = 'profit';
options.password = 'magister';

/*------------------------------ UTILITY -------------------------------*/
// function ab2str(buf) {
//     return String.fromCharCode.apply(null, new Uint16Array(buf));
//  }
 
//  function str2ab(str) {
//     var buf = new ArrayBuffer(str.length*2); // 2 bytes for each char
//     var bufView = new Uint16Array(buf);
//     for (var i=0, strLen=str.length; i<strLen; i++) {
//        bufView[i] = str.charCodeAt(i);
//     }
//     return buf;
//  }

function encodeString(s) {
    return Buffer.from(windows1251.encode(s), 'binary')
}

function decodeString(b) {
    return windows1251.decode(b.toString('binary'))
}

firebird.attach(options, (err, db)=> {
    if (err) throw err;
        
    console.log('.......Try to update record 2 with NAME_OP Kirilica-Кирилица');
    //db.query('Update NAMES set NAME_OP= \'Kirilica-Кирилица\' where ID_OP=2 returning ID_OP, NAME_OP',[] , (err, result) =>{
    //db.query('Update NAMES set NAME_OP= \'' + 'Kirilica-Кирилица' + '\' where ID_OP=2 returning ID_OP, NAME_OP',[] , (err, result) =>{
    //db.query('Update NAMES set NAME_OP=? where ID_OP=? returning ID_OP, NAME_OP',['Kirilica-Кирилица', 2] , (err, result) =>{
    
    // ['Kirilica-Кирилица', 2] => // 2 Kirilica-РљРёСЂРёР»РёС†Р°   // NAME_OP: <Buffer 4b 69 72 69 6c 69 63 61 2d d0 9a d0 b8 d1 80 d0 b8 d0 bb d0 b8 d1 86 d0 b0>,
    // [encodeString('Kirilica-Кирилица'), 2]  // 2 Kirilica-пїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅ  // NAME_OP: <Buffer 4b 69 72 69 6c 69 63 61 2d ef bf bd ef bf bd ef bf bd ef bf bd ef bf bd ef bf bd ef bf bd ef bf bd>,
    db.query('Update NAMES set NAME_OP=? where ID_OP=? returning ID_OP, NAME_OP',[encodeString('Kirilica-Кирилица'), 2] , (err, result) =>{                    
        if (err) throw err;
        console.log('.......updated row:')        
        console.log(result);
        console.log('.......returned data: ' + result.ID_OP + ' ' + decodeString(result.NAME_OP));

        db.query('SELECT * FROM NAMES WHERE ID_OP=? OR ID_OP=?', [1, 2], function(err, rows) {
            if (err) throw err;
            console.log('.......all rows:')
            console.log(rows);
            rows.forEach(row => {
                console.log('.......returned data: ' +  row.ID_OP + ' ' + decodeString(row.NAME_OP));
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