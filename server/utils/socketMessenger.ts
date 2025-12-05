export function sendIdentityMessage(peer: any, playerId: number, gameId: string, playerName: string) {
    const identityMessage = JSON.stringify({
        type: 'identity',
        playerId,
        gameId,
        playerName
    });
    peer.send(identityMessage);

}

export function sendErrorMessage(peer: any, message: string) {
    const errorMessage = JSON.stringify({ type: 'error', message: message, timestamp: new Date().toISOString() });
    peer.send(errorMessage);
}