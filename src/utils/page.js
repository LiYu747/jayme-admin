/** 
 * 删除后，页数是否跳转到最后一页
 * @param currentPage 当前页
 * @param totalPages 最后一页
 * @param numberOfElements 当前页数量
 * @param number 删除数量
 */
function getLastPage(currentPage, totalPages, numberOfElements, number = 1) {
    // 当前是最后一页的最后一个，删除后，页数-1
    if (
        currentPage >= totalPages &&
        numberOfElements <= number
    ) {
        currentPage <= 0 ? "" : currentPage--;
    }
    return currentPage;
}

export {
    getLastPage
}