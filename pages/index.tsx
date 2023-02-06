import Head from 'next/head'
import { useCallback } from 'react'
import { PrimitiveType, useIntl } from 'react-intl'
import React from 'react'
import { useRouter } from 'next/router'
import styles from '../styles/Home.module.css'

const HomePage = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id: string) => formatMessage({ id }), [formatMessage])

  return (
    <div className={styles.container}>
      <Head>
        <title>GovsStack testing</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <p>{format('govstack.title')}</p>
      </main>
    </div>
  )
}

export default HomePage
