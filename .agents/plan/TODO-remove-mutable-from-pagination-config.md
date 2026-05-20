remove all var mutation in

handler: (offset, limit) => {
    const searchText = model.searchBar.searchText.trim()
    const params: {
      limit: number
      offset: number
      author?: string
      articleSlug?: string
    } = { limit, offset }

    if (searchText) {
      if (searchText.startsWith('author:')) {
        params.author = searchText.slice(7).trim()
      } else if (searchText.startsWith('@')) {
        params.author = searchText.slice(1).trim()
      } else if (searchText.startsWith('article:')) {
        params.articleSlug = searchText.slice(8).trim()
      } else if (searchText.startsWith('slug:')) {
        params.articleSlug = searchText.slice(5).trim()
      } else {
        params.author = searchText
      }
    }

    return pipe(
      shared.token,
      O.fold(
        () =>
          TE.left({
            _tag: 'HttpError',
            error: {
              _tag: 'ApiError',
              errors: { body: ['Not authenticated'] },
            },
          } as any),
        (token) =>
          pipe(
            getAdminComments(token, {
              ...params,
              sort: model.searchBar.sort.attr,
              direction: model.searchBar.sort.direction,
            }),
            TE.map((res) => ({
              items: res.comments,
              totalCount: res.totalCount,
            })),
          ),
      ),
    )
  },