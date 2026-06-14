import { useState, useCallback } from 'react'

export function useConfirm() {
  const [confirmState, setConfirmState] = useState({
    open: false,
    title: '',
    description: '',
    onConfirm: null,
  })

  const confirm = useCallback(({ title, description, onConfirm }) => {
    setConfirmState({ open: true, title, description, onConfirm })
  }, [])

  const handleConfirm = useCallback(() => {
  console.log('handleConfirm dipanggil', confirmState.onConfirm)
  const fn = confirmState.onConfirm
  setConfirmState(prev => ({ ...prev, open: false }))
  if (fn) fn()
}, [confirmState])

  const handleCancel = useCallback(() => {
    setConfirmState(prev => ({ ...prev, open: false }))
  }, [])

  return { confirmState, confirm, handleConfirm, handleCancel }
}