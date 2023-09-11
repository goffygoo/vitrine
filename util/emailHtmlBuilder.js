export const getVerifyHtml = (token) => {
	return `
        <h2>Kindly click on the link to verify your email address<h2><br>
        <a href="http://localhost:3000/verifyEmail/${token}"><h1>Verify</h1></a><br>
        <p>${token}</p><br>
        <br>
        <h2>Please do NOT reply to this email</h2>
    `;
};

export const getResetPasswordHtml = (token) => {
	return `
        <h2>Kindly click on the link to reset your password <h2><br>
        <a href="http://localhost:3000/reset/${token}"><h1>Reset</h1></a><br>
        <p>${token}</p><br>
        <br>
        <h2>Please do NOT reply to this email</h2>
    `;
};

export const getSubscriptionEndNotificationHtml = (spaceId, consumer) => {
	return `
        <h2>Hello ${consumer}, </h2> </br>
        <h3>Your Subscription for space ${spaceId} will end today. 
        Recharge or else you'll bada pachtaoge</h3>
    `;
};

export const getSubscriptionEndedHtml = (spaceId, consumer) => {
	return `
        <h2>Hello ${consumer}, </h2> </br>
        <h3>Your Subscription for space ${spaceId} has ended. 
        Recharge to get access to you favourite contents.</h3>
    `;
};
