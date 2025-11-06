const express = require('express');
const { exec } = require('child_process');
const axios = require('axios');
const app = express();

app.use(express.json());

// Rota para combinar vídeo e áudio
app.post('/combine', async (req, res) => {
  try {
    const { videoUrl, audioUrl } = req.body;
    
    // Comando FFmpeg para combinar
    const command = `ffmpeg -i "${videoUrl}" -i "${audioUrl}" -c:v copy -c:a aac -shortest -y /tmp/output.mp4`;
    
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error('Erro FFmpeg:', error);
        return res.status(500).json({ error: 'Erro ao processar vídeo' });
      }
      
      res.json({ 
        success: true, 
        message: "Vídeo combinado com sucesso!",
        downloadUrl: "/tmp/output.mp4" 
      });
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rota de saúde
app.get('/health', (req, res) => {
  res.json({ status: 'online', service: 'n8n-video-combiner' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
