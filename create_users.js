const authors = require('./authors3.json')
const axios = require('axios')

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
}

promises=[]
keys = Object.keys(authors)
/* adds user */
q=0
asyncForEach(keys.reverse(), async permalink => {
    promises.push(axios({
        method: 'post',
        url: 'https://1btcarg.com/users',
        data: {
            "name":authors[permalink],
            "email":permalink+"@1btcarg.com",
            "password":,
            "username":permalink
        },
        headers: {
            'Api-Key': '',
            'Api-Username': ''
        }
    }));
    ++q;
    if( q > 200 ) {
        console.log("waiting results")
        let results = await Promise.allSettled(promises);
        results.forEach( (result,i) => {
            if(result.status == 'rejected') {
                console.log('error',result.reason.toJSON());
            }
        });
        await new Promise(r => setTimeout(r, 2000));
        promises=[];
        q=0;
    }
})
/**/


//checks if is in CSV file and if not inserts
/*asyncForEach(Object.keys(authors), async permalink => {
    if( !csv.includes( permalink ) )
    if(promises.length<=200)
        promises.push(axios({
            method: 'post',
            url: 'http://188.166.30.233:4567/api/v2/users/',
            data: {
            fullname: authors[permalink],
            username: permalink
            },
            headers: {
                'Authorization': 'Bearer 032f2ff4-f779-45b6-830c-32268781630d',
            }
        }))
    else {
        try{
            let results = await Promise.all(promises)
            await new Promise(r => setTimeout(r, 2000));
        }catch(e){
            console.log("error",permalink,e)
            process.exit()
        }
        promises=[]
    }
});*/