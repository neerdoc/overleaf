import { useTranslation } from 'react-i18next'
import { Button } from 'react-bootstrap'
import Tooltip from '../../../shared/components/tooltip'
import Icon from '../../../shared/components/icon'
import { useDetachCompileContext as useCompileContext } from '../../../shared/context/detach-compile-context'

function PdfSignButton() {
  const { pdfUrl } = useCompileContext()

  const { t } = useTranslation()
  const description = pdfUrl
    ? t('sign_pdf')
    : t('please_compile_pdf_before_signing')


  // const handleSignButtonClick = useCallback(() => {
  //   startSigningWorkflow()
  // }, [recompileButtonTextVariant, startCompile])

  return (
    <Tooltip
      id="logs-toggle"
      description={description}
      overlayProps={{ placement: 'bottom' }}
    >
      <Button
        bsStyle="link"
        disabled={!pdfUrl}
        download
        href={pdfUrl || '#'}
        target="_blank"
        style={{ pointerEvents: 'auto' }}
      >
        <Icon type="pencil" fw />
      </Button>
    </Tooltip>
  )
}

export default PdfSignButton
