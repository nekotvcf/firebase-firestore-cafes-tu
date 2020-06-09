//https://firebase.google.com/docs/firestore/query-data/get-data?hl=ko#%EC%9B%B9
//https://www.youtube.com/watch?v=kmTECF0JZyQ&list=PL4cUxeGkcC9itfjle0ji1xOZ2cjRGY_WB&index=3

const cafeList = document.querySelector('#cafe-list');
const form = document.querySelector('#add-cafe-form');

const renderCafe = doc => {
    let li = document.createElement('li');
    let name = document.createElement('span');
    let city = document.createElement('span');
    let cross = document.createElement('div');

    li.setAttribute('data-id', doc.id);
    name.textContent = doc.data().name;
    city.textContent = doc.data().city;
    cross.textContent = 'x';

    li.appendChild(name);
    li.appendChild(city);
    li.appendChild(cross);

    cafeList.appendChild(li);

    //deleting data
    cross.addEventListener('click', e => {
        e.stopPropagation();
        let id = e.target.parentElement.getAttribute('data-id');
        console.log(id);
        db.collection('cafes').doc(id).delete();
    })
}

// //전체를 들고올때
// db.collection('cafes').get().then(snapshot => {
//     // console.log("docs=", snapshot.docs);

//     //이렇게도 가능1
//     // snapshot.forEach(function(doc) {
//     //     console.log("d=", doc.id, doc.data());
//     // });

//     //이렇게도 가능2
//     // snapshot.docs.forEach(doc => {
//     //     console.log("id=", doc.id);
//     //     console.log("data=", doc.data());
//     // });

//     snapshot.docs.forEach(doc => {
//         renderCafe(doc);
//     });
// });


//개별 1개를 들고올때 이렇게 가능
// const docRef = db.collection('cafes').doc('TwoNkfrjaJEGt8Gzxl62');
// docRef.get().then(doc => {
//     if(doc.exists) {
//         console.log("doc=", doc.data());
//     } else {
//         console.log("No such document");
//     }
// }).catch(error => {
//     console.log("error=", error);
// });


// //조건을 줘서 가져올때
// db.collection('cafes').where('city', '==', 'Seoul').get().then(snapshot => {
//     snapshot.docs.forEach(doc => {
//         renderCafe(doc);
//     });
// });

// // Order by 
// db.collection('cafes').orderBy('name').get().then(snapshot => {
//     snapshot.docs.forEach(doc => {
//         renderCafe(doc);
//     });
// });

// // where + orderBy
// // 복합색인 만들기 필요
// db.collection('cafes').where('city', '==', 'Jeju').orderBy('name').get().then(snapshot => {
//     snapshot.docs.forEach(doc => {
//         renderCafe(doc);
//     })
// });


// real-time listener
db.collection('cafes').orderBy('city').onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    console.log(changes);
    changes.forEach(change => {
        if(change.type === 'added') {
            renderCafe(change.doc);
        } else if (change.type === 'removed') {
            console.log("doc.id=", change.doc.id);
            let li = cafeList.querySelector("[data-id='" + change.doc.id + "']");
            cafeList.removeChild(li);
        }
    })
});


// Saving data
form.addEventListener('submit', e => {
    e.preventDefault();
    db.collection('cafes').add({
        name: form.name.value,
        city: form.city.value
    });
    form.name.value = "";
    form.city.value = "";
});

//update : 다른것 안건드리고 변경항목만 업데이트
// db.collection('cafes').doc('VZP6s7wpAvKMZpNJlWGd').update({
//     city: 'New York'
// });

//set : 전체 document를 새로운 개체로 변경해 버림.. 즉.. 아래를 수행하면 name컬럼이 없어짐
// db.collection('cafes').doc('VZP6s7wpAvKMZpNJlWGd').set({
//     city: 'Liverpool'
// });
