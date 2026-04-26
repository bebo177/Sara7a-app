import { BadRequestException } from "../common/utils/responses/error.response.js";
import { client } from "./redis.js";
import { deleteOne } from './database.service';

export const set = async ({key, value , ttl}={})=>{
if (typeof value == 'object'){
    value = JSON.stringify(value);
}
if (ttl) {
    let expireData = await client.set(
        key,
        value,
        {EX: ttl}
    )
    return expireData;
}
let data = await client.set(
    key,
    value
)
return data;
}

export const get = async(key)=>{
    let data = await client.get(key);
    try{
        data = JSON.parse(data);
    }catch (error) {
    }
    return data ;
}

export const ttl = async(key)=>{
    let data = await client.ttl(key);
    return data;
}

export const exists = async(key)=>{
    let exisitedData = await client.exists(key);
    return exisitedData;
}
export const increment = async(key)=>{
    let incrementedData = await client.incr(key);
    return incrementedData;
}
export const redisDelete = async(key)=>{
let deleteData = await client.del(key);
return deleteData;
}
export const mSet = async(...keys)=>{
let data = await client.mSet(keys);
return data;
}
export const mget = async(...keys)=>{
    let data = await client.mGet(keys);
    return data;
}
export const keys = async(perfix)=>{
    let data = client.keys(`${perfix}*`)
    return data;
}
export const generateRevokeky = ({userId , jti}={})=>{
    return`revokeToken::${userId}::${jti}`
}