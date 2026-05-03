const prisma = require('../db')

const saveVisitor = async (visitorId, page, path, browser, language, screenWidth, screenHeight, visitedAt) => {
    return await prisma.visitor.create({
        data: {
            visitor_id: visitorId,
            page,
            path,
            browser,
            language,
            screen_width: screenWidth,
            screen_height: screenHeight,
            visited_at: visitedAt
        }
    })
}

const getAllVisitors = async () => {
    return await prisma.visitor.findMany({
        orderBy: { created_at: 'desc' }
    })
}

module.exports = { saveVisitor, getAllVisitors }