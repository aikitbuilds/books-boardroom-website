import { Router, Request, Response } from 'express';
import { ReadyModeService } from '../services/readymode/readymode-service';
import { ReadyModeApiRequest, ReadyModeLeadData } from '../services/readymode/types';
import { PostLeadToDialerAgent, GHLLeadData, PostLeadOptions } from '../agents/post-lead-to-dialer-agent';

const router = Router();
const readyModeService = ReadyModeService.getInstance();
const postLeadAgent = new PostLeadToDialerAgent();

/**
 * POST /api/readymode/send-lead
 * Send lead to ReadyMode dialer
 */
router.post('/send-lead', async (req: Request, res: Response): Promise<void> => {
  try {
    // TODO: Add authentication middleware
    // For now, we'll assume the request is authenticated
    
    const { leadData, channelId, apiUrl, options } = req.body;

    // Validate input data
    if (!leadData) {
      res.status(400).json({
        success: false,
        error: 'Lead data is required'
      });
      return;
    }

    // Create request object
    const request: ReadyModeApiRequest = {
      leadData: leadData as ReadyModeLeadData,
      channelId,
      apiUrl,
      options
    };

    // Send lead to ReadyMode
    const result = await readyModeService.sendLead(request);

    // Log for debugging
    console.log('ReadyMode submission result:', {
      success: result.success,
      leadPhone: request.leadData.phone,
      channelId: request.channelId,
      xencall_leadId: result.success ? result.xencall_leadId : undefined
    });

    // Return result
    res.json(result);
  } catch (error) {
    console.error('Error in ReadyMode send-lead:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * GET /api/readymode/submissions
 * Get ReadyMode submission logs (admin only)
 */
router.get('/submissions', async (req: Request, res: Response): Promise<void> => {
  try {
    // TODO: Add admin authentication middleware
    
    const { limit = 50, offset = 0, phone, startDate, endDate } = req.query;

    // For now, return a simple message
    // This would be implemented with Firestore queries
    res.json({
      message: 'ReadyMode submissions endpoint (to be implemented with authentication)',
      query: { limit, offset, phone, startDate, endDate }
    });
  } catch (error) {
    console.error('Error in ReadyMode submissions:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * POST /api/readymode/test-config
 * Test ReadyMode configuration
 */
router.post('/test-config', async (req: Request, res: Response): Promise<void> => {
  try {
    const { channelId, apiUrl } = req.body;

    // Validate that we have a proper API URL
    const effectiveApiUrl = apiUrl || 
      process.env[`READYMODE_${channelId?.toUpperCase()}_API_URL`] || 
      process.env.READYMODE_PRIMARY_API_URL;
    
    if (!effectiveApiUrl || effectiveApiUrl === 'your_readymode_channel_api_url_here') {
      res.json({
        success: false,
        error: 'ReadyMode API URL not configured',
        configured: false
      });
      return;
    }

    // Validate URL format
    const urlRegex = /^https:\/\/[a-zA-Z0-9._-]+\.readymode\.com\/lead-api\/[a-zA-Z0-9]+\/?$/;
    if (!urlRegex.test(effectiveApiUrl)) {
      res.json({
        success: false,
        error: 'Invalid ReadyMode API URL format',
        configured: false,
        expectedFormat: 'https://<yourCRM_or_s2s>.readymode.com/lead-api/<YOURAPIENDPOINT>'
      });
      return;
    }

    res.json({
      success: true,
      configured: true,
      apiUrl: effectiveApiUrl,
      message: 'ReadyMode configuration appears valid'
    });
  } catch (error) {
    console.error('Error in ReadyMode test-config:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * GET /api/readymode/config
 * Get ReadyMode configuration status
 */
router.get('/config', async (req: Request, res: Response): Promise<void> => {
  try {
    const channels = [];
    
    // Check primary configuration
    const primaryUrl = process.env.READYMODE_PRIMARY_API_URL;
    if (primaryUrl && primaryUrl !== 'your_readymode_channel_api_url_here') {
      channels.push({
        id: 'primary',
        name: 'Primary Channel',
        configured: true,
        hasValidUrl: /readymode\.com/.test(primaryUrl)
      });
    }

    // Check for other channel configurations
    const envVars = Object.keys(process.env);
    const readyModeVars = envVars.filter(key => 
      key.startsWith('READYMODE_') && 
      key.endsWith('_API_URL') &&
      key !== 'READYMODE_PRIMARY_API_URL'
    );

    readyModeVars.forEach(envVar => {
      const channelId = envVar
        .replace('READYMODE_', '')
        .replace('_API_URL', '')
        .toLowerCase();
      
      const url = process.env[envVar];
      if (url && url !== 'your_readymode_channel_api_url_here') {
        channels.push({
          id: channelId,
          name: `${channelId} Channel`,
          configured: true,
          hasValidUrl: /readymode\.com/.test(url)
        });
      }
    });

    res.json({
      configured: channels.length > 0,
      channels,
      totalChannels: channels.length,
      enableLogging: process.env.READYMODE_ENABLE_LOGGING === 'true',
      enableDuplicateCheck: process.env.READYMODE_CHECK_DUPLICATES === 'true'
    });
  } catch (error) {
    console.error('Error in ReadyMode config:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * POST /api/readymode/process-lead
 * Process lead through MCP Agent (includes qualification, routing, and posting)
 */
router.post('/process-lead', async (req: Request, res: Response): Promise<void> => {
  try {
    const { leadData, options } = req.body;

    if (!leadData) {
      res.status(400).json({
        success: false,
        error: 'Lead data is required'
      });
      return;
    }

    // Process lead through MCP agent
    const result = await postLeadAgent.processLead(leadData as GHLLeadData, options as PostLeadOptions);

    res.json(result);
  } catch (error) {
    console.error('Error in ReadyMode process-lead:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * POST /api/readymode/process-lead-batch
 * Process multiple leads in batch through MCP Agent
 */
router.post('/process-lead-batch', async (req: Request, res: Response): Promise<void> => {
  try {
    const { leads, options } = req.body;

    if (!leads || !Array.isArray(leads)) {
      res.status(400).json({
        success: false,
        error: 'Leads array is required'
      });
      return;
    }

    // Process leads through MCP agent
    const result = await postLeadAgent.processLeadBatch(leads as GHLLeadData[], options as PostLeadOptions);

    res.json(result);
  } catch (error) {
    console.error('Error in ReadyMode process-lead-batch:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

export default router; 