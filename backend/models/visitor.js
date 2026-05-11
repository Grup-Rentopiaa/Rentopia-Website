const prisma = require('../lib/prisma')

const saveVisitor = async (visitorId, page, path, browser, language, screenWidth, screenHeight, visitedAt, consent) => {
    return await prisma.visitor.create({
        data: {
            visitor_id: visitorId,
            page,
            path,
            browser,
            language,
            screen_width: screenWidth,
            screen_height: screenHeight,
            visited_at: visitedAt,
            consent_necessary: consent?.necessary ?? true,
            consent_preferences: consent?.prefs ?? false,
            consent_statistics: consent?.stats ?? false,
            consent_marketing: consent?.marketing ?? false
        }
    })
}

const getAllVisitors = async () => {
    return await prisma.visitor.findMany({
        orderBy: { created_at: 'desc' }
    })
}

module.exports = { saveVisitor, getAllVisitors }