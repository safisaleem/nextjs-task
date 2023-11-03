import path, { resolve } from "path";

const fs = require('fs');
const csv = require('csv-parser');

type file = {
    created: string;
    filename: string;
}

function sortByCreated(data: file[]){
    return data.sort((a: file, b: file) => { 
        const aDate: any = new Date(a.created);
        const bDate: any = new Date(b.created);

        return aDate-bDate;
    })

}

function sortByFilename(data: file[], type: string){
   let sorted = data.sort((a: file, b: file) => { 
        let anum = a.filename.match(/(\d+)/); // this will extract the number in the string
        let bnum = b.filename.match(/(\d+)/); // this will extract the number in the string
        
        let aNumVal = parseInt(anum?.at(0) || '0');
        let bNumVal = parseInt(bnum?.at(0) || '0');

        if (aNumVal - bNumVal !== 0){
            return aNumVal - bNumVal;
        }

        return a.filename.localeCompare(b.filename);
    })

    if (type === "desc") {
        return sorted.reverse();
    }

    return sorted;

}

function sortData(data: file[], sort: string, type: string) {
    switch (sort) {
        case "created":
            return sortByCreated(data)
        case "filename":
            return sortByFilename(data, type)
        default:
            break;
    }
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)

    const sort = searchParams.get("sort") || 'created'
    const type = searchParams.get("type") || 'asc'

    console.log({sort, type})

    const results: any = [];
    const promise = new Promise((res, rej) => {
        fs.createReadStream(path.join(process.cwd(),'app','api','data.csv'))
        .pipe(csv({ headers:['created','filename'],separator: ';' }))
        .on('data', (data: any) => results.push(data))
        .on('end', () => {
            res(results)
        });
    })
    await promise

    const ret = sortData(results, sort, type);

    return Response.json(ret)
}
