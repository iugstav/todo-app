import Image from 'next/image'

import styles from './dataError.module.scss'

export function DataError() {
  return (
    <div className={styles.ifEmpty}>
      <div className={styles.undrawWrapper}>
        <Image
          src="/assets/data-not-found.svg"
          width={230}
          height={230}
          alt="Imagem de erro"
        />
      </div>
      <div className={styles.emptyText}>
        <p>Eita! Deu algum erro entre você e a gente.</p>
        <p>Sentimos muito. :&#40;</p>
      </div>
    </div>
  )
}
