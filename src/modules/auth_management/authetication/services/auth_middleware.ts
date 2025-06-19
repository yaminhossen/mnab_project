import { FastifyReply, FastifyRequest } from 'fastify';
import { anyObject } from '../../../common_types/object';
import db from '../models/db';
import { env } from 'process';

function parseCookieString(cookieString: any) {
    try {
        const cookieObj: any = {};
        const cookies = cookieString.split(';');
        cookies.forEach((cookie: any) => {
            const [key, value] = cookie.split('=');
            cookieObj[key.trim()] = decodeURIComponent(value);
        });
        return cookieObj;
    } catch (error) {
        return {};
    }
}

const auth_middleware = async (
    request: FastifyRequest,
    reply: FastifyReply,
) => {
    const secretKey = env.JTI;
    const jwt = require('jsonwebtoken');
    // const token = request.headers.authorization;
    const token = parseCookieString(request.headers.cookie)?.token;
    // const user_agent = request.headers['user-agent'];
    const fullUrl = request.url;
    const needUrl = fullUrl.split('/')[1];
    console.log('request token', token);
    console.log('request fullurl', fullUrl);

    if (!token || !token.startsWith('Bearer')) {
        return reply.redirect(`${fullUrl}/login`);
        // reply.code(401).send({ error: 'Unauthorized' });
        // return;
        // (decoded.user_type == 'account')
    }

    try {
        const decoded = jwt.verify(token.slice(7), secretKey);
        console.log('request decode', decoded);
        let models = await db();
        let user: any = {};
        console.log('req url', decoded);

        if (needUrl == 'api') {
            (request as anyObject).user = decoded;
            return;
        } else {
            if (decoded.user_type == 'account' && fullUrl.includes('account')) {
                user = await models.UserStaffsModel.findByPk(decoded.id);
            } else if (
                decoded.user_type == 'staff' &&
                fullUrl.includes('staff')
            ) {
                user = await models.UserStaffsModel.findByPk(decoded.id);
            } else if (
                decoded.user_type == 'teacher' &&
                fullUrl.includes('teacher')
            ) {
                user = await models.UserTeachersModel.findByPk(decoded.id);
            } else if (decoded.user_type == 'admin' && needUrl == 'admin') {
                user = await models.UserAdminsModel.findByPk(decoded.id);
            } else if (
                decoded.user_type == 'super-admin' &&
                fullUrl.includes('super-admin')
            ) {
                user = await models.UserStaffsModel.findByPk(decoded.id);
            } else if (
                decoded.user_type == 'admission-officer' &&
                fullUrl.includes('admission-officer')
            ) {
                user = await models.UserStaffsModel.findByPk(decoded.id);
            } else if (
                decoded.user_type == 'student' &&
                fullUrl.includes('student')
            ) {
                user = await models.UserStudentsModel.findByPk(decoded.id);
            } else if (
                decoded.user_type == 'parent' &&
                fullUrl.includes('parent')
            ) {
                user = await models.UserParentsModel.findByPk(decoded.id);
            } else {
                user = await models.User.findByPk(decoded.id);
            }
            // console.log('decoded', decoded);

            if (user && user.token == decoded.token) {
                (request as anyObject).user = decoded;
                return;
            } else {
                console.log('decoded user type', needUrl);

                // reply.code(401).send({ error: 'Unauthorized' });
                reply.redirect(`/${needUrl}/login`);
                return;
            }
        }
    } catch (error) {
        reply.code(401).send({ error: 'Unauthorized' });
        return;
    }
};

export default auth_middleware;
