process.env.NODE_ENV = 'test'
import { store } from './store.js'
import { app } from './index.js'
import type { Server } from 'http'

async function runTests() {
  console.log('--- Starting MirageMesh Backend E2E Validation Tests ---')
  store.reset()

  const port = 4099
  const server: Server = app.listen(port)
  const baseUrl = `http://localhost:${port}`

  try {
    // 1. Validation test on Decoy Creation
    console.log('\n[Test 1] Validate invalid decoy creation rejected')
    const invalidRes = await fetch(`${baseUrl}/api/decoys`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'ab' }), // Invalid name length & missing type
    })
    console.log(`Status: ${invalidRes.status}`)
    const invalidJson = await invalidRes.json()
    console.log('Validation Error Response:', invalidJson)
    if (invalidRes.status !== 400 || !invalidJson.error) {
      throw new Error('Test 1 Failed: Expected 400 validation error')
    }
    console.log('✓ Test 1 Passed: Validation properly rejects invalid decoy input.')

    // 2. Create Decoy 1 (Synthetic Credential)
    console.log('\n[Test 2] Create Synthetic Credential Decoy')
    const decoy1Res = await fetch(`${baseUrl}/api/decoys`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'AWS_STAGING_DEPLOY_KEY',
        type: 'credential',
        environment: 'staging',
      }),
    })
    const { decoy: decoy1 } = await decoy1Res.json()
    console.log('Created Decoy 1:', decoy1.id, decoy1.name, decoy1.syntheticValue)
    if (!decoy1.id || !decoy1.syntheticValue.startsWith('AKIA_')) {
      throw new Error('Test 2 Failed: Decoy 1 synthetic format invalid')
    }
    console.log('✓ Test 2 Passed: Synthetic credential decoy successfully created.')

    // 3. Create Decoy 2 (Fake Internal API Resource)
    console.log('\n[Test 3] Create Fake Internal API Resource Decoy')
    const decoy2Res = await fetch(`${baseUrl}/api/decoys`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'CUSTOMER_VAULT_ROUTE',
        type: 'api_endpoint',
        environment: 'staging',
      }),
    })
    const { decoy: decoy2 } = await decoy2Res.json()
    console.log('Created Decoy 2:', decoy2.id, decoy2.name, decoy2.syntheticValue)
    if (!decoy2.id || !decoy2.syntheticValue.includes('/api/internal/resource/')) {
      throw new Error('Test 3 Failed: Decoy 2 synthetic route invalid')
    }
    console.log('✓ Test 3 Passed: Fake internal API resource decoy created.')

    // 4. Test Controlled Canary: Unknown Resource (Must NOT record confirmed decoy hit)
    console.log('\n[Test 4] Unknown resource test endpoint (Should NOT trigger canary)')
    const unknownRes = await fetch(`${baseUrl}/api/internal/resource/unknown-resource-9999`)
    console.log(`Status: ${unknownRes.status}`)
    const unknownJson = await unknownRes.json()
    console.log('Unknown Resource Response:', unknownJson)
    if (unknownRes.status !== 404 || unknownJson.canaryTriggered !== false) {
      throw new Error('Test 4 Failed: Unknown resource triggered canary')
    }
    if (store.getEvents().length !== 0) {
      throw new Error('Test 4 Failed: Unknown resource recorded a security event!')
    }
    console.log('✓ Test 4 Passed: Unknown resource returned 404 and did not register a false positive.')

    // 5. Test Controlled Canary: Hit Decoy 1 via GET /api/internal/keys
    console.log('\n[Test 5] Trigger Decoy 1 via GET /api/internal/keys')
    const hitKeyRes = await fetch(`${baseUrl}/api/internal/keys`, {
      headers: { Authorization: `Bearer ${decoy1.syntheticValue}` },
    })
    console.log(`Status: ${hitKeyRes.status}`)
    const hitKeyJson = await hitKeyRes.json()
    console.log('Canary Hit Response:', hitKeyJson)
    if (hitKeyRes.status !== 200 || !hitKeyJson.canaryTriggered) {
      throw new Error('Test 5 Failed: Canary not triggered for valid key')
    }
    if (hitKeyJson.riskScore !== 70) {
      throw new Error(`Test 5 Failed: Expected initial risk score 70, got ${hitKeyJson.riskScore}`)
    }
    if (hitKeyJson.severity !== 'high') {
      throw new Error(`Test 5 Failed: Expected initial severity high (score 70), got ${hitKeyJson.severity}`)
    }
    console.log('✓ Test 5 Passed: Decoy 1 triggered, security event created, deterministic base risk score = 70.')

    // 6. Test Repeat Trigger on Decoy 1 (Repeated interactions bounded contribution)
    console.log('\n[Test 6] Repeat Trigger on Decoy 1 (Repeated interactions score test)')
    const repeatHitRes = await fetch(`${baseUrl}/api/internal/keys`, {
      headers: { Authorization: `Bearer ${decoy1.syntheticValue}` },
    })
    const repeatHitJson = await repeatHitRes.json()
    console.log('Repeat Hit Response:', repeatHitJson)
    // 2 events, 1 distinct decoy: base 70 + repeat (1 * 5 = 5) = 75 (Critical band)
    if (repeatHitJson.riskScore !== 75) {
      throw new Error(`Test 6 Failed: Expected repeat risk score 75, got ${repeatHitJson.riskScore}`)
    }
    if (repeatHitJson.severity !== 'critical') {
      throw new Error(`Test 6 Failed: Expected critical severity (score 75), got ${repeatHitJson.severity}`)
    }
    console.log('✓ Test 6 Passed: Repeat interaction correctly updated risk score to 75 (Critical).')

    // 7. Test Triggering Decoy 2 via GET /api/internal/resource/:resourceId (Multi-decoy enumeration test)
    console.log('\n[Test 7] Trigger Decoy 2 via GET /api/internal/resource/:resourceId')
    // Can pass decoy2.id
    const decoy2HitRes = await fetch(`${baseUrl}/api/internal/resource/${decoy2.id}`)
    const decoy2HitJson = await decoy2HitRes.json()
    console.log('Decoy 2 Hit Response:', decoy2HitJson)
    // 3 events, 2 distinct decoys: base 70 + repeat (2 * 5 = 10) + enum (1 * 10 = 10) = 90 (Critical band)
    if (decoy2HitJson.riskScore !== 90) {
      throw new Error(`Test 7 Failed: Expected multi-decoy risk score 90, got ${decoy2HitJson.riskScore}`)
    }
    console.log('✓ Test 7 Passed: Multi-decoy enumeration correctly added bounded contribution (Score: 90).')

    // 8. Test Incident details
    console.log('\n[Test 8] Query Incidents')
    const incidentsRes = await fetch(`${baseUrl}/api/incidents`)
    const { incidents } = await incidentsRes.json()
    console.log(`Total incidents: ${incidents.length}`)
    const inc = incidents[0]
    console.log('Incident ID:', inc.id)
    console.log('Risk Score:', inc.riskScore)
    console.log('Related Decoys:', inc.relatedDecoyIds)
    console.log('Related Events:', inc.relatedEventIds.length)
    console.log('Risk Factors:', inc.riskFactors)
    console.log('Analysis Summary:', inc.analysis?.summary)

    if (incidents.length !== 1) {
      throw new Error('Test 8 Failed: Expected 1 correlated incident')
    }
    if (inc.relatedDecoyIds.length !== 2) {
      throw new Error('Test 8 Failed: Expected incident to track both affected decoys')
    }
    if (inc.relatedEventIds.length !== 3) {
      throw new Error('Test 8 Failed: Expected incident to correlate 3 telemetry events')
    }
    console.log('✓ Test 8 Passed: Incident dossier accurately reflects correlated events and risk factors.')

    // 9. Test GET /admin/export
    console.log('\n[Test 9] Test GET /admin/export with token')
    const exportRes = await fetch(`${baseUrl}/admin/export?token=${decoy1.syntheticValue}`)
    const exportJson = await exportRes.json()
    console.log('Admin Export Response:', exportJson)
    if (exportRes.status !== 200 || !exportJson.canaryTriggered) {
      throw new Error('Test 9 Failed: Admin export canary did not trigger')
    }
    console.log('✓ Test 9 Passed: Admin export controlled test endpoint triggered cleanly.')

    console.log('\n========================================')
    console.log('ALL 9 BACKEND VALIDATION TESTS PASSED!')
    console.log('========================================\n')
    server.close(() => {
      process.exit(0)
    })
  } catch (err) {
    server.close(() => {
      console.error(err)
      process.exit(1)
    })
  }
}

runTests()
