import express from 'express';
import MarketplaceItem from '../models/MarketPlaceItem.js';

const router = express.Router();

// POST /api/marketplace/items
router.post('/items', async (req, res) => {
    try {
        // require authentication via middleware in server.js (see mount step)
        const user = req.user;
        if (!user) return res.status(401).json({ error: 'Not authenticated' });

        const { title, description, category, isPremium, price, html, css } = req.body;
        if (!title) return res.status(400).json({ error: 'Title is required' });

        const item = new MarketplaceItem({
            title,
            description,
            category,
            isPremium: !!isPremium,
            price: Number(price) || 0,
            html,
            css,
            owner: user._id,
            published: true
        });

        await item.save();
        res.json({ success: true, item });
    } catch (err) {
        console.error('Marketplace upload error:', err);
        res.status(500).json({ error: 'Failed to save item' });
    }
});

export default router;