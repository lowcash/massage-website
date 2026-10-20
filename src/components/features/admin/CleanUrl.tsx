'use client'

import { useEffect } from 'react'

/**
 * Opening /admin as http://user:password@host/admin logs in, but browsers refuse every fetch() to a URL that
 * contains credentials, so nothing could be saved afterwards. The login cookie is already set by now, so
 * reload the same page without the credentials.
 */
export default function CleanUrl() {
  useEffect(() => {
    // location.href hides the credentials in Chromium, document.URL keeps them.
    const url = new URL(document.URL)

    if (url.username || url.password) {
      url.username = ''
      url.password = ''
      window.location.replace(url.toString())
    }
  }, [])

  return null
}
