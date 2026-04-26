import jwt from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';
import { JwtAdminRefreshSignature, JwtAdminSignature, JwtUserRefreshSignature, JwtUserSignature} from '../../../config/index.js';
import { UnAuthorizedException } from '../utils/responses/index.js';
import { generateRevokekey, set } from '../../database/redis.service.js';
export const generateToken = async (user , issuer) => {
    let signiture = undefined;
    let audience = undefined;
    let refreshSignature = undefined;
    switch (user.role) {
        case "0":
            signiture= JwtAdminSignature;
            refreshSignature = JwtAdminRefreshSignature;
            audience = "Admin";
            break;

            default: signiture = JwtUserSignature;
            refreshSignature = JwtUserRefreshSignature;
            audience = "User";
            break;
    }
  const jti = uuidv4();
  let accessToken = jwt.sign({ id: user._id , jti}, JwtUserSignature,{
    expiresIn: "30m",
    issuer,
    audience,
  });
  const refreshjti = uuidv4();
  let refreshToken = jwt.sign({ id: user._id , jti: refreshJti}, refreshSignature, {
    expiresIn: "1y",
    issuer,
    audience,
  });
  let decoded = jwt.verify(accessToken , signature);
  const ttl = (decoded.exp - decoded.iat)
  const revokekey = generateRevokekey({userId: user.id , jti});
  await set ({
    key: revokekey,
    value: 0,
    ttl
  })
  return { accessToken , refreshToken};
};

export const decodeToken = (token)=>{
    let decoded = jwt.decode(token);
    if(!decoded) {
        return UnAuthorizedException();
    }
    let signature = undefined; 
    switch (decoded.aud){
        case "Admin": 
        siganture = JwtAdminSignature;
        break;

        default:
            signature = JwtAdminSignature;
            break;
    }
    let verified = jwt.verify(token,signature)
    return verified;
}

export const decodeRefreshToken = (token)=>{
    let decoded = jwt.decode(token);
    if (!decoded) {
        return UnAuthorizedException();
    }
    let refreshSignature = undefined;
    switch (decode.aud) {
        case "Admin":
            refreshSignature = JwtAdminRefreshSignature;
            break;
            
            default:
                refreshSignature = JwtUserRefreshSignature;
                break;

    }
    let verified = jwt.verify(token, refreshSignature)
    return verified;
}