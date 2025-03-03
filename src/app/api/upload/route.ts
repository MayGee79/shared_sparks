import { NextResponse } from 'next/server'
import cloudinary from '@/lib/cloudinary'
import { logger } from '@/lib/logger'

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      logger.warn('Upload attempted without file')
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64File = `data:${file.type};base64,${buffer.toString('base64')}`

    // Upload to cloudinary
    const result = await cloudinary.uploader.upload(base64File, {
      folder: 'profile-pictures'
    })

    logger.info('File uploaded successfully', { url: result.secure_url })
    return NextResponse.json({ url: result.secure_url })
  } catch (error) {
    logger.error('Upload failed:', { error })
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    )
  }
}
