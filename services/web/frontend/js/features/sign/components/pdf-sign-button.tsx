import { useTranslation } from 'react-i18next'
import { Button } from 'react-bootstrap'
import { useCallback } from 'react'
import Tooltip from '../../../shared/components/tooltip'
import Icon from '../../../shared/components/icon'
import { useDetachCompileContext as useCompileContext } from '../../../shared/context/detach-compile-context'
import { useState, useEffect } from 'react';

// Get the refresh token from the environment.
const ZohoRefreshToken = process.env.ZOHO_REFRESH_TOKEN
const ZohoClientID = process.env.ZOHO_CLIENT_ID
const ZohoClientSecret = process.env.ZOHO_CLIENT_SECRET
const [ZohoAccessToken, setZohoAccessToken ] = useState('');

function PdfSignButton() {
  const { pdfUrl } = useCompileContext()

  const { t } = useTranslation()
  const description = pdfUrl
    ? t('sign_pdf')
    : t('please_compile_pdf_before_signing')

  const handleSignButtonClick = useCallback(async () => {
    // Debugging first.
    console.log("Clicked sign!");
    console.log("Refresh token is " + ZohoRefreshToken)
    // Get the access token.
    await getAccessToken();
    console.log("Access token is " + ZohoAccessToken)
  })

  return (
    <Tooltip
      id="logs-toggle"
      description={description}
      overlayProps={{ placement: 'bottom' }}
    >
      <Button
        bsStyle="primary"
        disabled={!pdfUrl}
        onClick={handleSignButtonClick}
      >
        <Icon type="pencil" fw />
      </Button>
    </Tooltip>
  )
}

// Function to retrieve a new access token since they are only valid for 1 h. 
async function getAccessToken() {
  let response = await fetch('https://accounts.zoho.eu/oauth/v2/auth', {
    method: 'POST',
    body: JSON.stringify({
      grant_type: refresh_token,
      refresh_token: ZohoRefreshToken,
      client_id: ZohoClientID,
      client_secret: ZohoClientSecret,
    }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  });
  let data = await response.json();
  setZohoAccessToken(data.access_token);
};

// Publish the button.
export default PdfSignButton
