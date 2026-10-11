package com.marknpark.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.marknpark.exception.BadRequestException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;
import java.util.Map;

@Service
public class CloudinaryService {

    private static final Logger log = LoggerFactory.getLogger(CloudinaryService.class);
    private final Cloudinary cloudinary;

    public CloudinaryService(@Value("${cloudinary.url:}") String cloudinaryUrl) {
        if (cloudinaryUrl != null && !cloudinaryUrl.trim().isEmpty() && !cloudinaryUrl.contains("<api_key>")) {
            this.cloudinary = new Cloudinary(cloudinaryUrl);
            log.info("Cloudinary service initialized with external URL");
        } else {
            this.cloudinary = null;
            log.info("Cloudinary URL not configured or placeholder detected. Operating in safe inline storage mode.");
        }
    }

    public String uploadImage(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("Image file cannot be empty");
        }

        // Validate content type
        String contentType = file.getContentType();
        if (contentType == null || (!contentType.equals("image/jpeg") && !contentType.equals("image/png") && !contentType.equals("image/webp"))) {
            throw new BadRequestException("Invalid file format. Only JPEG, PNG, and WebP images are permitted.");
        }

        // Validate size (max 5MB)
        if (file.getSize() > 5 * 1024 * 1024) {
            throw new BadRequestException("File size exceeds 5MB limit.");
        }

        try {
            if (cloudinary != null) {
                Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                        "folder", "marknpark/parking-zones",
                        "resource_type", "image"
                ));
                return (String) uploadResult.get("secure_url");
            } else {
                // Safe Data URI fallback for development / local demo
                String base64 = Base64.getEncoder().encodeToString(file.getBytes());
                return "data:" + contentType + ";base64," + base64;
            }
        } catch (IOException e) {
            log.error("Failed to upload image to storage", e);
            throw new BadRequestException("Failed to upload image: " + e.getMessage());
        }
    }
}
