const username_uid = require('./username_uid.json')
const axios = require('axios')
const fs = require('fs')

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
}

promises=[]
usernames = Object.keys(username_uid)
/* adds user */
q=0
asyncForEach(usernames, async (username,i) => {
    promises.push(axios({
        method: 'put',
        url: `https://1btcarg.com/admin/users/${username_uid[username]}/activate`,
        headers: {
            'Api-Key': '',
            'Api-Username': 'mrb'
        }
    }));
    ++q;
    if( q > 200 || i == usernames.length-1  ) {
        console.log("waiting results")
        let results = await Promise.allSettled(promises);
        results.forEach( (result,i) => {
            if(result.status == 'rejected') {
                console.log('error',i,result.reason);
            }else{
                console.log(i,result.value.data)
            }
        });
        await new Promise(r => setTimeout(r, 2000));
        promises=[];
        q=0;
        //fs.writeFileSync(`./api_keys.json`,JSON.stringify(api_keys));
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